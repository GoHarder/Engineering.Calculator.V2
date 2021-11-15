/**
 * @module tokens The tokens route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import * as validate from '../../lib/validate.mjs';
import { capitalize } from '../../../lib/string.mjs';
import { app as appDB } from '../../data/mongodb/mongodb.mjs';
import { hash as getHash, signToken } from '../../lib/crypto.mjs';
import { checkAuth } from '../../middleware/lib.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// - Post
router.post('/', async (req, res) => {
   // Validate the request body
   const schema = {
      email: (value) => validate.email(value),
      password: (value) => validate.password(value),
      longToken: (value) => validate.boolean(value),
   };

   const test1 = validate.object(req.body, schema);

   if (!test1.valid) return res.status(400).json({ message: `${capitalize(test1.errors[0])} is invalid` });

   // Lookup users document
   let { email, password, longToken } = req.body;
   let userDoc = undefined;

   try {
      userDoc = await appDB.collection('users').findOne({ email });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (!userDoc) return res.status(404).json({ message: `Could not find user` });

   // Validate the user
   const docSchema = {
      email: (value) => value === email,
      hashedPassword: (value) => value === getHash(password),
   };

   const test2 = validate.object(userDoc, docSchema);

   if (!test2.valid) return res.status(401).json({ message: `${capitalize(test2.errors[0])} is invalid` });

   // Create the token and send it
   const exp = Math.floor(Date.now() / 1000) + 60 * 60 * (longToken ? 336 : 1);

   // TODO: 11-11-2021 3:16 PM - remove the admin boolean before rolling out
   let token = {
      _id: userDoc._id,
      role: userDoc.role,
      exp,
   };

   token = signToken(token);

   res.status(200).json({ token });
});

// - Put
router.put('/', checkAuth, (req, res) => {
   let { token } = req;

   // See if the token need to be renewed
   const newExp = Math.floor(Date.now() / 1000) + 60 * 60;

   if (token.exp < newExp) token.exp = newExp;

   token = signToken(token);

   res.status(200).json({ token });
});
