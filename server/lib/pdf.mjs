/**
 * @module pdf A module to create pdf reports
 * documentation http://pdfkit.org/
 */

// Node Imports
import PDFDocument from 'pdfkit';

const options = {
   size: 'LETTER',
};

const setMetaData = (doc, user, project) => {
   const { customer, jobName } = project;

   doc.info.Author = `${user.firstName} ${user.lastName}`;
   doc.info.Title = `Engineering Calculator - ${jobName}`;
   doc.info.Subject = `${jobName} for ${customer}`;
};

/**
 * Creates a pdf document
 * @param {object} user The User data
 * @param {object} project The project data
 * @param {function} onData A function to run when data is received
 * @param {function} onEnd A function to run when the request is complete
 */
export const build = (user, project, onData, onEnd) => {
   const doc = new PDFDocument(options);

   doc.on('data', onData);
   doc.on('end', onEnd);

   doc.registerFont('base', 'Helvetica');
   doc.registerFont('bold', 'Helvetica-Bold');
   doc.registerFont('italic', 'Helvetica-Oblique');
   doc.registerFont('bold-italic', 'Helvetica-BoldOblique');

   setMetaData(doc, user, project);

   const { carNo, contract, customer, jobName, layout } = project;

   doc.font('bold').text(`Job Name: ${jobName} car ${carNo}`, { align: 'center' });
   doc.text(`Customer: ${customer}`, { align: 'center' });
   doc.font('base').text(`contract: ${contract} layout: ${layout}`, { align: 'center' });

   doc.end();
};
