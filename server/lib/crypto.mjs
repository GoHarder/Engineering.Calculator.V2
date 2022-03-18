/**
 * @module crypto Library for various cryptography functions
 */

// Node Imports
import { createHmac, randomBytes } from 'crypto';

// NPM Imports
import jwt from 'jsonwebtoken';

// Project Imports
import { env } from './env.mjs';

// The hash secret
const hashStr = process.env.HASH || env.HASH;

/**
 * Creates a SHA256 hash string
 * @param {string} str The string to be hashed
 */
export const hash = (str) => createHmac('sha256', hashStr).update(str).digest('hex');

/**
 * Creates a random string of alphanumeric characters
 * @param {number} length The length of the string
 */
export const randomStr = (length = 10) => randomBytes(length).toString('base64').slice(0, length);

/**
 * Creates a random string of alphanumeric characters
 * @param {number} length The length of the string
 */
export const randomPassword = (length = 10) => {
   let password = randomStr(length);

   password = password.replace('/', '');

   if (!password.match(/[a-z]/g)) {
      password += 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26));
   }

   if (!password.match(/[A-Z]/g)) {
      password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26));
   }

   if (!password.match(/[0-9]/g)) {
      password += '0123456789'.charAt(Math.floor(Math.random() * 10));
   }

   if (!password.match(/[~!@#$%^&*()_\+\-\=]/g)) {
      password += '[~!@#$%^&*()_+-=]'.charAt(Math.floor(Math.random() * 17));
   }

   if (!password.match(/\S{8,15}/g)) {
      do {
         password += 'x';
      } while (password.length < 8);
   }

   return password;
};

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
      if (error.name === 'TokenExpiredError') {
         return { message: `Session has expired at ${error.expiredAt}` };
      }

      let message = error.message.replace('jwt', 'Authorization');
      message = message.replace('malformed', 'is malformed');

      return { message };
   }
};
