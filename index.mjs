/**
 * @module index The main application module
 */

// Project Imports
import { getEnv } from './server/lib/env.mjs';
import { hr, style } from './server/lib/terminal.mjs';

import { init as server } from './server/server.mjs';
import { init as mongodb } from './server/data/mongodb/mongodb.mjs';

const { protocol, host, name, port } = getEnv();

/** Starts the application */
const init = async () => {
   console.log(style('Environment:', { bold: true }), name);

   try {
      await mongodb();
      await server();
   } catch (error) {
      console.log(error);
   }
};

init().then(() => {
   const url = `${protocol}://${host}:${port}`;

   console.log(style('\nAccess URL:', { bold: true }));
   console.log(hr(32));
   if (host === 'localhost') console.log(`Localhost: ${style(url, { underline: true, color: 'magenta' })}`);
   console.log(hr(32));
   console.log(style('Press CTRL-C to stop\n', { bold: true, color: 'blue' }));
});
