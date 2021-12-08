/**
 * @module lib Library of route middleware
 */

// Npm Imports
import { ObjectId } from 'mongodb';

// Project Imports
import { verifyToken } from '../lib/crypto.mjs';
import { expire, get } from '../data/redis/redis.mjs';

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

   try {
      token._id = new ObjectId(token._id);
   } catch (error) {
      return res.status().json({ message: error.message });
   }

   req.token = token;

   next();
};

export const checkCache = async (req, res, next) => {
   let cache = await get(req.originalUrl);

   if (cache) {
      await expire(req.originalUrl);
      cache = JSON.parse(cache);
      return res.status(200).json(cache);
   }

   next();
};
