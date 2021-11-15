/**
 * @module tokens The tokens route handler
 */

// NPM Imports
import express from 'express';
import { ObjectId } from 'mongodb';

// Project Imports
import { signToken, verifyToken } from '../../lib/crypto.mjs';
import { app as appDB } from '../../data/mongodb/mongodb.mjs';
import * as validate from '../../lib/validate.mjs';
import { randomStr } from '../../lib/crypto.mjs';
import { sendResetPassword } from '../../lib/mailgun.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// - Get
router.get('/', async (req, res) => {
   // Verify the token
   let token = req.headers.authorization?.split(' ')[1];

   token = verifyToken(token);

   if (!token) return res.status(401).json({ message: 'Authorization is invalid' });

   let { _id } = token;

   // Sanitize _ids
   _id = ObjectId(_id);

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

router.get('/:email', async (req, res) => {
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

   res.status(200).json({ token });
});
