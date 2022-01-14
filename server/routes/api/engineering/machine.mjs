/**
 * @module machine The machine route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { checkAuth, checkCache } from '../../../middleware/lib.mjs';
import { getMachines } from '../../../data/mongodb/pipelines/machine.mjs';
import { eng as engDB } from '../../../data/mongodb/mongodb.mjs';
import { setEx } from '../../../data/redis/redis.mjs';

/** The router for the module */
export const router = express.Router();

// Middleware
router.use([checkAuth, checkCache]);

// Routes

// - Get
router.get('/', async (req, res) => {
   const { query } = req;

   const { type, location } = query;
   const speed = parseInt(query.speed);
   const capacity = parseInt(query.capacity);
   const counterbalance = parseFloat(query.counterbalance);
   const roping = parseInt(query.roping);

   let machines = [];
   let maxRimWidth = 0;

   try {
      const _machines = getMachines(counterbalance, speed, capacity, type, location, roping);

      machines = await engDB.collection('machines').aggregate(_machines).toArray();

      maxRimWidth = await engDB.collection('machines').distinct('sheaves.rimWidth');

      maxRimWidth = maxRimWidth[maxRimWidth.length - 1];
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   const docs = { machines, maxRimWidth };

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});
