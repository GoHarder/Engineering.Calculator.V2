/**
 * @module tokens The tokens route handler
 */

// NPM Imports
import express from 'express';
import { ObjectId } from 'mongodb';

// Project Imports
import { verifyToken } from '../../lib/crypto.mjs';
import { app as appDB } from '../../data/mongodb/mongodb.mjs';

/** The router for the module */
export const router = express.Router();

// Authorization check
router.all('/', (req, res, next) => {
   // Verify the token
   let token = req.headers.authorization?.split(' ')[1];

   token = verifyToken(token);

   if (!token) return res.status(401).json({ message: 'Authorization is invalid' });

   // Attach to req and go to route
   req.token = token;

   next();
});

// Routes

// - Get
router.get('/', async (req, res) => {
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
