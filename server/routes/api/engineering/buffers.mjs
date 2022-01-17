/**
 * @module buffers The buffers route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { checkAuth, checkCache } from '../../../middleware/lib.mjs';
import { eng as engDB } from '../../../data/mongodb/mongodb.mjs';
import { getBufferSprings, getOilBuffers } from '../../../data/mongodb/pipelines/buffers.mjs';
import { setEx } from '../../../data/redis/redis.mjs';

/** The router for the module */
export const router = express.Router();

// Middleware
router.use([checkAuth, checkCache]);

// Routes

// - Get
router.get('/oil', async (req, res) => {
   const { query } = req;

   const speed = parseInt(query.speed);
   const load = parseInt(query.load);

   let docs = [];

   try {
      const _buffers = getOilBuffers(load, speed);

      docs = await engDB.collection('oil_buffers').aggregate(_buffers).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   // await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});

router.get('/spring', async (req, res) => {
   const { query } = req;

   const speed = parseInt(query.speed);
   const minLoad = parseInt(query.minLoad);
   const maxLoad = parseInt(query.maxLoad);

   let docs = [];

   try {
      const _buffers = getBufferSprings(minLoad, maxLoad, speed);

      docs = await engDB.collection('buffer_springs').aggregate(_buffers).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   // await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});
