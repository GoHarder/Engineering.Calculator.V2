/**
 * @module crypto Library for various cryptography functions
 */

// Node Imports
import { createHmac } from 'crypto';

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
 * Creates a JSON web token
 * @param {object} payload The payload of the token
 */
export const signToken = (payload) => jwt.sign(payload, hashStr, { noTimestamp: true });
