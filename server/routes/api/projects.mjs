/**
 * @module projects The projects route handler
 */

// NPM Imports
import express from 'express';
import { ObjectId } from 'mongodb';

// Project Imports
import { app as appDB } from '../../data/mongodb/mongodb.mjs';
import { byRecentlyOpened, bySearch } from '../../data/mongodb/pipelines/projects.mjs';
import { checkAuth } from '../../middleware/lib.mjs';
import * as validate from '../../../lib/validate.mjs';
import { capitalize } from '../../../lib/string.mjs';
import { sendSharedProject } from '../../lib/mailgun.mjs';

/** The router for the module */
export const router = express.Router();

// Middleware

/**
 * Converts the query string to numbers
 * @param req The request object
 * @param res The response object
 * @param next Forwards to next part of handler
 */
const sanitizeQuery = (req, res, next) => {
   req.query.page = parseInt(req.query.page);
   req.query.length = parseInt(req.query.length);

   next();
};

/**
 * Sanitizes the project body
 * @param req The request object
 * @param res The response object
 * @param next Forwards to next part of handler
 */
const sanitizeBody = (req, res, next) => {
   const { body } = req;

   // Sanitize ids
   body.creator._id = new ObjectId(body.creator._id);
   if (body._id) body._id = new ObjectId(body._id);
   if (body.checkout) body.checkout = new ObjectId(body.checkout);

   // Sanitize dates
   body.created = new Date(body.created);

   // Sanitize arrays
   body.opened = body.opened.map((user) => {
      user._id = new ObjectId(user._id);
      user.date = new Date(user.date);
      return user;
   });

   body.notes = body.notes.map((note) => {
      note.date = new Date(note.date);
      return note;
   });

   next();
};

// Routes

// - Post
router.post('/', [checkAuth, sanitizeBody], async (req, res) => {
   let updateInfo;

   try {
      updateInfo = await appDB.collection('projects').insertOne(req.body);
      req.body._id = updateInfo.insertedId;
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   res.status(200).json(req.body);
});

router.post('/check-in/:_id', async (req, res) => {
   let { _id } = req.params;

   let updateInfo;

   try {
      _id = new ObjectId(_id);

      updateInfo = await appDB.collection('projects').updateMany({ checkout: _id }, { $unset: { checkout: 1 } });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.modifiedCount === 0) return res.status(200).json({ message: 'Nothing was changed' });

   res.status(204).send();
});

// - Get
router.get('/id/:_id', [checkAuth], async (req, res) => {
   let { token, params } = req;
   let { _id } = params;

   // Get the documents
   let doc;

   try {
      _id = new ObjectId(_id);

      doc = await appDB.collection('projects').findOne({ _id });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (!doc) return res.status(404).json({ message: 'Workbook not found' });

   // If the document is checked out just return
   if (doc.checkout) return res.status(200).json(doc);

   // Checkout the document
   doc.checkout = token._id;

   let updateInfo = undefined;

   try {
      updateInfo = appDB.collection('projects').updateOne({ _id }, { $set: doc });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.modifiedCount === 0) return res.status(500).json({ message: 'Nothing was changed' });

   res.status(200).json(doc);
});

router.get('/recent', [checkAuth, sanitizeQuery], async (req, res) => {
   const { token, query } = req;
   let { _id } = token;

   // Validate the request query
   const schema = {
      page: (value) => value > 0,
      length: (value) => value > 0,
   };

   const test = validate.object(query, schema);

   if (!test.valid) return res.status(400).json({ message: `${capitalize(test.errors[0])} is invalid` });

   // Get the documents
   let docs, count;

   // Create pipelines
   const _docs = byRecentlyOpened(_id, (query.page - 1) * query.length, query.length);
   const _count = [_docs[0], { $count: 'total' }];

   try {
      docs = await appDB.collection('projects').aggregate(_docs).toArray();
      count = await appDB.collection('projects').aggregate(_count).next();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (docs === undefined) res.status(500).json({ message: 'Could not get workbooks' });

   res.status(200).json({ docs, length: count?.total || 0 });
});

router.get('/search', [checkAuth, sanitizeQuery], async (req, res) => {
   const { query } = req;

   // Validate the request query
   const schema = {
      page: (value) => value > 0,
      length: (value) => value > 0,
   };

   const test = validate.object(query, schema);

   if (!test.valid) return res.status(400).json({ message: `${capitalize(test.errors[0])} is invalid` });

   // Get the documents
   let docs, count;

   // Create pipelines
   const _docs = bySearch(query.search, (query.page - 1) * query.length, query.length);
   const _count = [_docs[0], { $count: 'total' }];

   try {
      docs = await appDB.collection('projects').aggregate(_docs).toArray();
      count = await appDB.collection('projects').aggregate(_count).next();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (docs === undefined) res.status(500).json({ message: 'Could not get workbooks' });

   res.status(200).json({ docs, length: count?.total ?? 0 });
});

// - Put
router.put('/', [checkAuth, sanitizeBody], async (req, res) => {
   let updateInfo;

   try {
      updateInfo = await appDB.collection('projects').updateOne({ _id: req.body._id }, { $set: req.body });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.modifiedCount === 0) return res.status(400).json({ message: 'Nothing was changed' });

   res.status(200).json(req.body);
});

router.put('/share/:email', [checkAuth, sanitizeBody], async (req, res) => {
   const { body, params, token } = req;
   let { email } = params;

   // Get the sender
   let senderDoc;

   const projection = {
      _id: 0,
      email: 0,
      hashedPassword: 0,
      role: 0,
   };

   try {
      senderDoc = await appDB.collection('users').findOne({ _id: token._id }, { projection });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   // Save project
   let updateInfo;

   try {
      updateInfo = await appDB.collection('projects').updateOne({ _id: req.body._id }, { $set: req.body });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.modifiedCount === 0) return res.status(400).json({ message: 'Nothing was changed' });

   // Send the email
   const projectString = [body.contract ? `#${body.contract} -` : '', body.jobName, body.carNo ? `car(s) ${body.carNo}` : '', body.customer ? `for ${body.customer}` : '']
      .join(' ')
      .trim();

   const sentEmail = await sendSharedProject(email, { ...senderDoc, project: projectString });

   if (!sentEmail) return res.status(500).json({ message: `Could not send email` });

   res.status(200).json(req.body);
});

// - Delete
router.delete('/:_id', [checkAuth], async (req, res) => {
   let { _id } = req.params;

   let updateInfo;

   try {
      _id = new ObjectId(_id);

      updateInfo = await appDB.collection('projects').deleteOne({ _id });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.deletedCount === 0) return res.status(400).json({ message: 'Nothing was deleted' });

   res.status(204).send();
});
