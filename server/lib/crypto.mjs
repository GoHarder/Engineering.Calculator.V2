/**
 * @module crypto Library for various cryptography functions
 */

// Node Imports
import { createHmac, randomBytes } from 'crypto';

// NPM Imports
import jwt from 'jsonwebtoken';

// Project Imports
import { getEnv } from './env.mjs';

// The hash secret
const { hash: hashStr } = getEnv();

/**
 * Creates a SHA256 hash string
 * @param {string} str The string to be hashed
 */
export const hash = (str) => createHmac('sha256', hashStr).update(str).digest('hex');

/**
 * Creates a random string of alphanumeric characters
 * @param {number} length The length of the string
 */
export const randomStr = (length = 20) => randomBytes(length).toString('base64').slice(0, length);

/**
 * Creates a JSON web token
 * @param {object} payload The payload of the token
 */
export const signToken = (payload) => jwt.sign(payload, hashStr, { noTimestamp: true });

/**
 * Verifies the token and returns the payload
 * @param {string} token The token string
 */
export const verifyToken = (token) => {
   try {
      const payload = jwt.verify(token, hashStr);

      return payload;
   } catch (error) {
      console.log(error);
      return undefined;
   }
};
