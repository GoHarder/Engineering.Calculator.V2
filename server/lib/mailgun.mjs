/**
 * @module mailgun Library to work with the mailgun api
 */

// NPM Imports
import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Project Imports
import { env } from '../lib/env.mjs';
import { build, getTemplate } from '../lib/template.mjs';

const { baseUrl, mailgunDomain, mailgunFrom, mailgunKey, mailgunSender } = env;

/** Main part of the subject string */
const subjectTitle = 'Engineering Calculator | ';

// Setting up the mailgun client
const mailgun = new Mailgun(formData);

const client = mailgun.client({ username: 'api', key: mailgunKey });

/**
 * Sends an email through mailgun
 * @param to The email address to send to
 * @param subject The subject of the email
 * @param html The body of the email
 */
const send = async (to, subject, html) => {
   try {
      await client.messages.create(mailgunDomain, {
         'h:sender': `no-reply(via Eng Calc) <${mailgunSender}>`,
         from: `no-reply(via Eng Calc) <${mailgunFrom}>`,
         to,
         subject: `${subjectTitle}${subject}`,
         html,
      });

      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
};

/**
 * Sends the reset password email
 * @param {string} to The recipients email
 * @param {string} resetCode The reset code to send
 */
export const sendResetPassword = (to, resetCode) => {
   let baseTemplate = getTemplate('base-email.html');
   let bodyTemplate = getTemplate('reset-password.html');

   const subject = 'Reset Password';

   const props = {
      emailTitle: `${subjectTitle}${subject}`,
      resetCode,
      baseUrl,
   };

   baseTemplate = build(baseTemplate, { message: bodyTemplate });
   baseTemplate = build(baseTemplate, props);

   return send(to, subject, baseTemplate);
};

/**
 * Sends the shared project email
 * @param {string} to The recipients email
 * @param {object} props The information to fill out the email template
 */
export const sendSharedProject = (to, props = {}) => {
   let baseTemplate = getTemplate('base-email.html');
   let bodyTemplate = getTemplate('share-project.html');

   const subject = 'Shared Workbook';

   props = {
      ...props,
      emailTitle: `${subjectTitle}${subject}`,
      baseUrl,
   };

   baseTemplate = build(baseTemplate, { message: bodyTemplate });
   baseTemplate = build(baseTemplate, props);

   return send(to, subject, baseTemplate);
};

export const sendNewUser = (to, props = {}) => {
   let baseTemplate = getTemplate('base-email.html');
   let bodyTemplate = getTemplate('new-user.html');

   const subject = 'Registration';

   props = {
      ...props,
      emailTitle: `${subjectTitle}${subject}`,
      baseUrl,
   };

   baseTemplate = build(baseTemplate, { message: bodyTemplate });
   baseTemplate = build(baseTemplate, props);

   return send(to, subject, baseTemplate);
};
