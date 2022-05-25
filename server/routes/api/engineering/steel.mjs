/**
 * @module steel The steel route handler
 */

// NPM Imports
import express from 'express';
import { ObjectId } from 'mongodb';

// Project Imports
import { checkAuth } from '../../../middleware/lib.mjs';
import { bySearch } from '../../../data/mongodb/pipelines/steel.mjs';
import { eng as engDB } from '../../../data/mongodb/mongodb.mjs';

/** The router for the module */
export const router = express.Router();

// Middleware
router.use(checkAuth);

// Routes

// - Get
router.get('/', async (req, res) => {
   const { token, query } = req;

   if (token.role === 'user') return res.status(401).json({ message: 'User does not have permission' });

   // Sanitize query
   query.page = parseInt(query.page);
   query.length = parseInt(query.length);

   let docs = undefined;
   let count = undefined;

   const _docs = bySearch(query.search, (query.page - 1) * query.length, query.length);
   const _count = [_docs[0], { $count: 'total' }];

   try {
      docs = await engDB.collection('steel').aggregate(_docs).toArray();
      count = await engDB.collection('steel').aggregate(_count).next();
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (!docs || docs.length === 0) return res.status(404).json({ message: `Nothing was found by searching "${query.search}"` });

   res.status(200).json({ docs, count: count?.total });
});

// - Put
router.put('/', async (req, res) => {
   const { token, body } = req;

   if (token.role === 'user') return res.status(401).json({ message: 'User does not have permission' });

   const sort = ['Stocked', 'Available', 'Check'];

   // Prepare the payload
   body._stockStatusSort = sort.findIndex((nth) => nth === body.stockStatus);

   let updateInfo;

   try {
      body._id = new ObjectId(body._id);

      updateInfo = await engDB.collection('steel').updateOne({ _id: body._id }, { $set: { ...body } });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }

   if (updateInfo.modifiedCount === 0) return res.status(400).json({ message: 'Nothing was changed' });

   res.status(200).json(req.body);
});
