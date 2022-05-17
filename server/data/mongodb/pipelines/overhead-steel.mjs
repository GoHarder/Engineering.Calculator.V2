/**
 * @module overhead-steel The overhead steel aggregation pipelines
 */

/**
 * Creates an aggregation for overhead channels
 * @param {('C'|'MC')} shape The shape of the beam
 */
export const getChannels = (shape) => {
   return [
      { $match: { shape: 'channel', material: 'ASTM A36', name: new RegExp(`^${shape}`) } },
      { $sort: { depth: 1, weight: 1 } },
      { $unset: ['area', 'flangeWidth', 'gage', 'material', 'shape', 'webThickness', '_nameSort', '_specialSort', '_stockStatusSort'] },
   ];
};

/**
 * Creates an aggregation for overhead beams
 * @param {('S'|'W')} shape The shape of the channel
 */
export const getBeams = (shape) => {
   const sortStep = [shape === 'W' ? '_depthSort' : 'depth', 'weight'].reduce((obj, key) => {
      obj[key] = 1;
      return obj;
   }, {});

   return [
      { $match: { shape: 'beam', name: new RegExp(`^${shape}`) } },
      { $sort: sortStep },
      { $unset: ['area', 'flangeWidth', 'gage', 'material', 'shape', 'webThickness', '_depthSort', '_nameSort', '_specialSort', '_stockStatusSort'] },
   ];
};
