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

   setMetaData(doc, user, project);

   doc.fontSize(12).text('This is some example text.');
   doc.end();
};
