/**
 * @module machine The machine aggregation pipelines
 */

/**
 * Creates an aggregation for the machines
 * @param {number} counterbalance The elevator counterbalance
 * @param {number} speed The machine speed
 * @param {number} capacity The machine capacity
 * @param {string} type The machine type
 * @param {string} location The machine location
 * @param {number} roping The elevator roping
 * @param {number} shaftLoad The sheave shaft load
 */
export const getMachines = (counterbalance, speed, capacity, type, location, roping, shaftLoad) => {
   const cbKey = `capAt${counterbalance.toFixed(3).replace(/0\.(\d{2})(\d)/, '$1_$2')}`;

   const validCB = ['capAt40_0', 'capAt42_5', 'capAt45_0', 'capAt50_0'].includes(cbKey);

   const match = { speed: { $gte: speed } };

   let cond = { $gte: ['$$limit.speed', speed] };

   if (validCB) {
      match[cbKey] = { $gte: capacity };
      cond = { $and: [cond, { $gte: [`$$limit.${cbKey}`, capacity] }] };
   }

   return [
      { $unwind: { path: '$sheaves' } },
      {
         $match: {
            type,
            location,
            roping,
            'sheaves.limits': { $elemMatch: match },
            'sheaves.maxSystemLoad': { $elemMatch: { speed: { $gte: speed }, load: { $gte: shaftLoad } } },
         },
      },
      { $unwind: { path: '$ropeGrippers' } },
      {
         $addFields: {
            // 'sheaves.limits': { $filter: { input: '$sheaves.limits', as: 'limit', cond } },
            'ropeGrippers.ropings': { $filter: { input: '$ropeGrippers.ropings', as: 'nth', cond: { $eq: ['$$nth.roping', 1] } } },
         },
      },
      {
         $project: {
            _id: 1,
            name: 1,
            bases: 1,
            centerOfGravity: 1,
            ropeGrippers: {
               name: 1,
               maxCapacity: { $first: '$ropeGrippers.ropings.maxCapacity' },
               maxLoad: { $first: '$ropeGrippers.ropings.maxLoad' },
               maxSpeed: { $first: '$ropeGrippers.ropings.maxSpeed' },
               minCapacity: { $first: '$ropeGrippers.ropings.minCapacity' },
               minLoad: { $first: '$ropeGrippers.ropings.minLoad' },
               outToOut: 1,
               weight: 1,
            },
            sheaves: 1,
         },
      },
      {
         $group: {
            _id: '$_id',
            name: { $first: '$name' },
            bases: { $first: '$bases' },
            centerOfGravity: { $first: '$centerOfGravity' },
            ropeGrippers: { $addToSet: '$ropeGrippers' },
            sheaves: { $addToSet: '$sheaves' },
         },
      },
      {
         $addFields: {
            ropeGrippers: {
               $filter: {
                  input: '$ropeGrippers',
                  as: 'nth',
                  cond: { $and: [{ $gte: ['$$nth.maxSpeed', speed] }, { $gte: ['$$nth.maxCapacity', capacity] }, { $lte: ['$$nth.minCapacity', capacity] }] },
               },
            },
         },
      },
      {
         $project: {
            _id: 1,
            name: 1,
            bases: 1,
            centerOfGravity: 1,
            ropeGrippers: { name: 1, maxLoad: 1, minLoad: 1, outToOut: 1, weight: 1 },
            sheaves: { diameter: 1, maxGroovePressure: 1, name: 1, rimWidth: 1 },
         },
      },
      { $sort: { name: 1 } },
   ];
};
