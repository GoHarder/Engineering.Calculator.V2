/**
 * @module base The base route handler
 */

// NPM Imports
import express from 'express';

// Project Imports
import { getTemplate, build } from '../lib/template.mjs';

/** The router for the module */
export const router = express.Router();

// Main html page
router.get('/', (req, res) => {
   let template = getTemplate('index.html');

   if (!template) return res.status(500).json({ message: 'Could not load index.html' });

   template = build(template, {});

   res.status(200).send(template);
});

// Ping
router.get('/ping', (req, res) => res.status(202).send());

// Static files route
router.use('/public', express.static('./public'));
