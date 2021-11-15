/**
 * @module mailgun Library to work with the mailgun api
 */

// NPM Imports
import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Project Imports
import { getEnv } from '../lib/env.mjs';
import { build, getTemplate } from '../lib/template.mjs';

const { baseUrl, mailgunDomain, mailgunFrom, mailgunKey, mailgunSender } = getEnv();

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

export const sendResetPassword = (to, resetCode) => {
   let template = getTemplate('reset-password.html');

   const subject = 'Reset Password';

   const props = {
      emailTitle: `${subjectTitle}${subject}`,
      resetCode,
      baseUrl,
   };

   template = build(template, props);

   return send(to, subject, template);
};
