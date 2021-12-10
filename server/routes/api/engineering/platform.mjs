/**
 * @module platform The platform route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { checkAuth, checkCache } from '../../../middleware/lib.mjs';
import { _angle, getChannel } from '../../../data/mongodb/pipelines/platform.mjs';
import { eng as engDB } from '../../../data/mongodb/mongodb.mjs';
import { setEx } from '../../../data/redis/redis.mjs';

/** The router for the module */
export const router = express.Router();

// Middleware
router.use([checkAuth, checkCache]);

// Routes

// - Get
router.get('/steel/:steelType', async (req, res) => {
   let docs = { message: 'ding' };

   const _channel = getChannel(req.params.steelType);

   try {
      docs = await engDB.collection('steel').aggregate(_channel).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});

router.get('/wood', async (req, res) => {
   let docs;

   try {
      docs = await engDB.collection('steel').aggregate(_angle).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});
