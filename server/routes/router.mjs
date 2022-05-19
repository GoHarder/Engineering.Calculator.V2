/**
 * @module base The base route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { getTemplate, build } from '../lib/template.mjs';
import { router as api } from './api/router.mjs';

/** The router for the module */
export const router = express.Router();

// Routes

// - Index page
router.get('/', (req, res) => {
   let template = getTemplate('index.html');

   if (!template) return res.status(500).json({ message: 'Could not load index.html' });

   template = build(template, {});

   res.status(200).send(template);
});

// - API
router.use('/api', api);

// - Ping
router.get('/ping', (req, res) => res.status(202).send());

// - Static files route
router.use(express.static('public'));
