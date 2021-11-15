/**
 * @module lib Library of route middleware
 */

// Project Imports
import { verifyToken } from '../lib/crypto.mjs';

/**
 * Checks the authorization header for a valid token
 * @param req The request object
 * @param res The response object
 * @param next Forwards to next part of handler
 */
export const checkAuth = (req, res, next) => {
   // Verify the token
   let token = req.headers.authorization?.split(' ')[1];

   token = verifyToken(token);

   if (!token) return res.status(401).json({ message: 'Authorization is invalid' });

   req.token = token;

   next();
};
