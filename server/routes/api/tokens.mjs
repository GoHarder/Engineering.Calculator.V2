/**
 * @module tokens The tokens route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import * as validate from '../../lib/validate.mjs';
import { capitalize } from '../../../lib/string.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// Post
router.post('/', (req, res) => {
   // Validate the request body
   const schema = {
      email: (value) => validate.email(value),
      password: (value) => validate.password(value),
      longToken: (value) => validate.boolean(value),
   };

   const test = validate.object(req.body, schema);

   if (!test.valid) return res.status(400).json({ message: `${capitalize(test.errors[0])} is invalid` });

   res.status(200).send();
});
