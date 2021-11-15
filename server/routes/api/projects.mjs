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
import * as validate from '../../lib/validate.mjs';
import { capitalize } from '../../../lib/string.mjs';

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

router.use(checkAuth, sanitizeQuery);

// Routes

// - Get
router.get('/recent', async (req, res) => {
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
      docs = await appDB.collection('proj').aggregate(_docs).toArray();
      count = await appDB.collection('proj').aggregate(_count).next();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (!docs || !count) res.status(500).json({ message: 'Could not get workbooks' });

   res.status(200).json({ docs, length: count.total });
});

router.get('/search', async (req, res) => {
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
      docs = await appDB.collection('proj').aggregate(_docs).toArray();
      count = await appDB.collection('proj').aggregate(_count).next();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (!docs || !count) res.status(500).json({ message: 'Could not get workbooks' });

   res.status(200).json({ docs, length: count.total });
});
