/**
 * @module cad A module to create auto cad block data
 */

// Node Imports
import { Readable } from 'stream';

export const build = (project, onData, onEnd) => {
   const string = JSON.stringify(project);
   const stream = Readable.from(string);

   stream.on('data', onData);
   stream.on('end', onEnd);
};
