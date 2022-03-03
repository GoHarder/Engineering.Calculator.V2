/**
 * @module overhead-steel The overhead steel aggregation pipelines
 */

/**
 * Creates an aggregation for overhead channels
 * @param {boolean} supplied If hollister-whitney supplies the steel
 * @param {('C'|'MC')} shape The shape of the beam
 */
export const getChannels = (supplied, shape) => {
   const sortStep = [supplied ? '_stockStatusSort' : '', 'depth', 'weight'].reduce((obj, key) => {
      if (key) obj[key] = 1;
      return obj;
   }, {});

   return [
      { $match: { shape: 'channel', material: 'ASTM A36', name: new RegExp(`^${shape}`) } },
      { $sort: sortStep },
      { $unset: ['_nameSort', '_specialSort', '_stockStatusSort'] },
      { $project: { area: 0, flangeWidth: 0, gage: 0, material: 0, webThickness: 0, shape: 0, _depthSort: 0 } },
   ];
};

/**
 * Creates an aggregation for overhead beams
 * @param {boolean} supplied If hollister-whitney supplies the steel
 * @param {('S'|'W')} shape The shape of the channel
 */
export const getBeams = (supplied, shape) => {
   const sortStep = [supplied ? '_stockStatusSort' : '', shape === 'W' ? '_depthSort' : 'depth', 'weight'].reduce((obj, key) => {
      if (key) obj[key] = 1;
      return obj;
   }, {});

   return [
      { $match: { shape: 'beam', name: new RegExp(`^${shape}`) } },
      { $sort: sortStep },
      { $unset: ['_nameSort', '_specialSort', '_stockStatusSort'] },
      { $project: { area: 0, flangeWidth: 0, gage: 0, material: 0, maxLength: 0, shape: 0, webThickness: 0, _depthSort: 0 } },
   ];
};
