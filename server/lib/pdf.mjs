/**
 * @module pdf A module to create pdf reports
 * documentation http://pdfkit.org/
 */

// Node Imports
import PDFDocument from 'pdfkit';

/**
 * Creates a pdf document
 * @param {function} onData A function to run when data is received
 * @param {function} onEnd A function to run when the request is complete
 */
export const build = (onData, onEnd) => {
   const doc = new PDFDocument();

   doc.on('data', onData);
   doc.on('end', onEnd);

   doc.fontSize(12).text('This is some example text.');
   doc.end();
};
