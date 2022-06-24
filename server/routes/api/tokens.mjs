/**
 * @module tokens The tokens route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import * as validate from '../../../lib/validate.mjs';
import { capitalize } from '../../../lib/string.mjs';
import { app as appDB } from '../../data/mongodb/mongodb.mjs';
import { hash as getHash, signToken, randomStr, hash } from '../../lib/crypto.mjs';
import { checkAuth } from '../../middleware/lib.mjs';
import { clone } from '../../../lib/main.mjs';

/** The router for the module */
export const router = express.Router();

/**
 * Updates the user password with salt for security
 * @param {object} userDoc The user document
 * @param {string} password The users password
 */
const addSalt = async (userDoc, password) => {
   const salt = randomStr(16);
   const hashedPassword = getHash(`${password}:${salt}`);
   userDoc = { ...userDoc, ...{ _salt: salt, hashedPassword, _schema: 2 } };
   appDB.collection('users').updateOne({ _id: userDoc._id }, { $set: userDoc });
};

// Routes

// - Post
router.post('/', async (req, res) => {
   // Validate the request body
   const schema = {
      email: (value) => validate.email(value),
      password: (value) => validate.password(value),
      longToken: (value) => validate.boolean(value),
   };

   const test1 = validate.schema(req.body, schema);

   if (!test1.valid) return res.status(400).json({ message: `${capitalize(test1.errors[0])} is invalid`, code: '00044' });

   // Lookup users document
   let { email, password, longToken } = req.body;
   let userDoc = undefined;

   try {
      const result = await appDB.collection('users').findOneAndUpdate({ email }, { $set: { _login: new Date(Date.now()) } });
      userDoc = result.value;
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (!userDoc) return res.status(404).json({ message: `Could not find user` });

   // Update schema to version 2
   let hashStr = password;
   if (userDoc._schema === 2) hashStr = `${password}:${userDoc._salt}`;

   // Validate the user
   const docSchema = {
      email: (value) => value === email,
      hashedPassword: (value) => value === getHash(hashStr),
   };

   const test2 = validate.schema(userDoc, docSchema);

   if (!test2.valid) return res.status(401).json({ message: `${capitalize(test2.errors[0]).replace('Hashed', '')} is invalid`, code: '00071' });

   // Upgrade to schema 2
   if (userDoc._schema === 1) addSalt(userDoc, password);

   // Create the token and send it
   const iat = Math.floor(Date.now() / 1000); // Issue date
   const exp = Math.floor(Date.now() / 1000) + 60 * 60 * (longToken ? 336 : 1); // Expiration date

   let token = {
      _id: userDoc._id,
      role: userDoc.role,
      iat,
      exp,
   };

   token = signToken(token);

   res.status(200).json({ token });
});

// - Put
router.put('/', checkAuth, (req, res) => {
   const copy = clone(req.token);
   const { _id, role } = copy;
   const iat = Math.floor(Date.now() / 1000);

   // See if the token need to be renewed
   let exp = Math.floor(Date.now() / 1000) + 60 * 60;
   if (copy.exp > exp) exp = copy.exp;

   let token = {
      _id,
      role,
      iat,
      exp,
   };

   token = signToken(token);

   res.status(200).json({ token });
});
