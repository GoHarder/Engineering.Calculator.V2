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
import { hash, randomStr } from '../../lib/crypto.mjs';
import { sendResetPassword } from '../../lib/mailgun.mjs';

/** The router for the module */
export const router = express.Router();

/**
 * Checks the authorization header for a valid token
 * @param req The request object
 * @param res The response object
 * @param next Forwards to next part of handler
 */
const checkAuth = (req, res, next) => {
   // Verify the token
   let token = req.headers.authorization?.split(' ')[1];

   token = verifyToken(token);

   if (!token) return res.status(401).json({ message: 'Authorization is invalid' });

   req.token = token;

   next();
};

// Routes

// - Get
router.get('/', checkAuth, async (req, res) => {
   let { _id } = req.token;

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

   if (!sentEmail) return res.status(500).json({ message: `Could not send email` });

   res.status(200).json({ token });
});

// - Put
router.put('/', checkAuth, async (req, res) => {
   const { body, token } = req;

   // Check if reset strings are valid
   if (body.reset !== token.reset) return res.status(401).json({ message: 'Authorization is invalid' });

   // Validate the payload
   if (!validate.password(body.password)) return res.status(400).json({ message: 'Password is invalid' });

   // Update the user document
   let updateInfo = undefined;

   try {
      const _id = ObjectId(token._id);
      const hashedPassword = hash(body.password);

      updateInfo = await appDB.collection('users').updateOne({ _id }, { $set: { hashedPassword } });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.modifiedCount === 0) return res.status(400).json({ message: 'Nothing was changed' });

   res.status(204).send();
});
