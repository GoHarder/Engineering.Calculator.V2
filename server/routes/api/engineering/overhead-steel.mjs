/**
 * @module overhead-steel The overhead steel route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { checkCache } from '../../../middleware/lib.mjs';
import { parseValue } from '../../../../lib/string.mjs';
import { getBeams, getChannels } from '../../../data/mongodb/pipelines/overhead-steel.mjs';
import { eng as engDB } from '../../../data/mongodb/mongodb.mjs';
import { setEx } from '../../../data/redis/redis.mjs';

/** The router for the module */
export const router = express.Router();

// Middleware
router.use([checkCache]);

// Routes

// - Get
router.get('/', async (req, res) => {
   const { query } = req;
   const supplied = parseValue(query.supplied);

   let sBeams = [];
   let wBeams = [];
   let cChannels = [];
   let mcChannels = [];

   try {
      const _cChannels = getChannels(supplied, 'C');
      const _mcChannels = getChannels(supplied, 'MC');
      const _sBeams = getBeams(supplied, 'S');
      const _wBeams = getBeams(supplied, 'W');

      sBeams = await engDB.collection('steel').aggregate(_sBeams).toArray();
      wBeams = await engDB.collection('steel').aggregate(_wBeams).toArray();
      cChannels = await engDB.collection('steel').aggregate(_cChannels).toArray();
      mcChannels = await engDB.collection('steel').aggregate(_mcChannels).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   const docs = { sBeams, wBeams, cChannels, mcChannels };

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});
