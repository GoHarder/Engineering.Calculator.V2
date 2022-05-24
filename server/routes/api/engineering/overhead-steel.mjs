/**
 * @module overhead-steel The overhead steel route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { checkAuth, checkCache } from '../../../middleware/lib.mjs';
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
   let sBeams = [];
   let wBeams = [];
   let cChannels = [];
   let mcChannels = [];

   try {
      const _cChannels = getChannels('C');
      const _mcChannels = getChannels('MC');
      const _sBeams = getBeams('S');
      const _wBeams = getBeams('W');

      cChannels = await engDB.collection('steel').aggregate(_cChannels).toArray();
      mcChannels = await engDB.collection('steel').aggregate(_mcChannels).toArray();
      sBeams = await engDB.collection('steel').aggregate(_sBeams).toArray();
      wBeams = await engDB.collection('steel').aggregate(_wBeams).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   const docs = { sBeams, wBeams, cChannels, mcChannels };

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(docs);
});

router.get('/sheaves', checkAuth, async (req, res) => {
   let sheaves = [];

   const projection = { bearingBore: 0, shaftDiameter: 0, _uses: 0, 'pillowBlocks.height': 0, 'pillowBlocks.width': 0, 'pillowBlocks.length': 0 };

   try {
      sheaves = await engDB.collection('sheaves').find({ _uses: 'overhead' }, { projection }).toArray();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   await setEx(req.originalUrl, JSON.stringify(docs));

   res.status(200).json(sheaves);
});
