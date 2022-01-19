/**
 * @module tokens The tokens route handler
 */

// NPM Imports
import express from 'express';
import { ObjectId } from 'mongodb';

// Project Imports
import { hash, signToken, randomPassword, randomStr } from '../../lib/crypto.mjs';
import { app as appDB } from '../../data/mongodb/mongodb.mjs';
import * as validate from '../../../lib/validate.mjs';
import { capitalize } from '../../../lib/string.mjs';
import { sendResetPassword } from '../../lib/mailgun.mjs';
import { checkAuth } from '../../middleware/lib.mjs';
import { sendNewUser } from '../../lib/mailgun.mjs';

/** The router for the module */
export const router = express.Router();

/** System roles */
const roles = ['user', 'admin', 'super'];

// Routes

// - Post
router.post('/', checkAuth, async (req, res) => {
   const { body, token } = req;

   // Validate the request query
   const schema = {
      email: (value) => validate.email(value),
      firstName: (value) => validate.string(value),
      lastName: (value) => validate.string(value),
      role: (value) => validate.string(value) && ['user', 'admin', 'super'].includes(value),
   };

   const test = validate.object(body, schema);

   if (!test.valid) return res.status(400).json({ message: `${capitalize(test.errors[0])} is invalid` });

   // Check request roles
   const tokenIndex = roles.findIndex((role) => role === token.role);

   const bodyIndex = roles.findIndex((role) => role === body.role);

   if (tokenIndex < bodyIndex) return res.status(403).json({ message: 'User does not have permission assign that role' });

   const password = randomPassword();

   body.hashedPassword = hash(password);

   // Add user
   let updateInfo = undefined;

   try {
      updateInfo = await appDB.collection('users').insertOne(req.body);
      body._id = updateInfo.insertedId;
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   // Send email
   const sentEmail = await sendNewUser(body.email, { password });

   if (!sentEmail) return res.status(500).json({ message: `Could not send email` });

   res.status(200).json(body);
});

// - Get
router.get('/all', checkAuth, async (req, res) => {
   let { _id } = req.token;

   let filter = { _id: { $ne: _id } };

   if (req.query.self === 'true') filter = {};

   const projection = {
      hashedPassword: 0,
   };

   const sort = {
      lastName: 1,
      firstName: 1,
   };

   let docs = [];

   try {
      docs = await appDB.collection('users').find(filter, { projection, sort }).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   res.status(200).json(docs);
});

router.get('/bearer', checkAuth, async (req, res) => {
   let { _id } = req.token;

   // Lookup the user
   let userDoc = undefined;

   try {
      userDoc = await appDB.collection('users').findOne({ _id }, { projection: { hashedPassword: 0 } });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (!userDoc) return res.status(404).json({ message: `Could not find user` });

   res.status(200).json(userDoc);
});

router.get('/email/:email', async (req, res) => {
   const { email } = req.params;

   if (!validate.email(email)) return res.status(400).json({ message: 'Email is invalid' });

   // Lookup the user
   let userDoc = undefined;

   try {
      userDoc = await appDB.collection('users').findOne({ email }, { projection: { hashedPassword: 0 } });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (!userDoc) return res.status(404).json({ message: `Could not find user` });

   // Create the token
   const exp = Math.floor(Date.now() / 1000) + 60 * 60;
   const reset = randomStr();

   let token = {
      _id: userDoc._id,
      reset,
      exp,
   };

   token = signToken(token);

   // Send user the reset email
   const sentEmail = await sendResetPassword(userDoc.email, reset);

   if (!sentEmail) return res.status(500).json({ message: `Could not send email` });

   res.status(200).json({ token });
});

// - Put
router.put('/', checkAuth, async (req, res) => {
   const { body, token } = req;

   // Sanitize the body
   body._id = new ObjectId(body._id);

   // Check if person is able to edit
   if (token.role === 'user' && body._id.toString() !== token._id.toString()) {
      return res.status(401).send({ message: 'Authorization is invalid' });
   }

   delete body._id;

   // If its a password change then hash it
   if (body.password) {
      body.hashedPassword = hash(body.password);
      delete body.password;
   }

   // Update the user document
   let updateInfo = undefined;

   try {
      updateInfo = await appDB.collection('users').updateOne({ _id: token._id }, { $set: body });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.modifiedCount === 0) return res.status(400).json({ message: 'Nothing was changed' });

   res.status(204).send();
});

router.put('/admin', checkAuth, async (req, res) => {
   const { body, token } = req;

   // See if user had permission
   const tokenIndex = roles.findIndex((role) => role === token.role);

   const bodyIndex = roles.findIndex((role) => role === body.role);

   if (tokenIndex < bodyIndex) return res.status(403).json({ message: 'User does not have permission to modify' });

   // Update the user document
   let updateInfo = undefined;

   try {
      body._id = new ObjectId(body._id);

      updateInfo = await appDB.collection('users').updateOne({ _id: body._id }, { $set: { ...body } });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.modifiedCount === 0) return res.status(400).json({ message: 'Nothing was changed' });

   res.status(204).send();
});

router.put('/reset-password', checkAuth, async (req, res) => {
   const { body, token } = req;

   // Check if reset strings are valid
   if (body.reset !== token.reset) return res.status(401).json({ message: 'Authorization is invalid' });

   // Validate the payload
   if (!validate.password(body.password)) return res.status(400).json({ message: 'Password is invalid' });

   // Update the user document
   let updateInfo = undefined;

   try {
      const _id = token._id;
      const hashedPassword = hash(body.password);

      updateInfo = await appDB.collection('users').updateOne({ _id }, { $set: { hashedPassword } });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.modifiedCount === 0) return res.status(400).json({ message: 'Nothing was changed' });

   res.status(204).send();
});

// - Delete
router.delete('/:_id', checkAuth, async (req, res) => {
   const { params, token } = req;
   let { _id } = params;

   // Find the user to delete
   let userDoc = undefined;

   try {
      _id = new ObjectId(_id);
      userDoc = await appDB.collection('users').findOne({ _id });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (!userDoc) return res.status(404).json({ message: 'User not found' });

   // See if user had permission
   const tokenIndex = roles.findIndex((role) => role === token.role);

   const docIndex = roles.findIndex((role) => role === userDoc.role);

   if (tokenIndex < docIndex) return res.status(403).json({ message: 'User does not have permission to delete' });

   // Delete user

   let updateInfo = undefined;

   try {
      updateInfo = await appDB.collection('users').deleteOne({ _id });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.deletedCount === 0) return res.status(400).json({ message: 'Nothing was changed' });

   res.status(204).send();
});
