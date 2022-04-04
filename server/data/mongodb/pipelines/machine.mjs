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
 */
export const getMachines = (counterbalance, speed, capacity, type, location, roping) => {
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
      { $match: { type, location, roping, 'sheaves.limits': { $elemMatch: match } } },
      {
         $addFields: {
            'sheaves.limits': {
               $filter: { input: '$sheaves.limits', as: 'limit', cond },
            },
         },
      },
      {
         $group: {
            _id: '$_id',
            name: { $first: '$name' },
            bases: { $first: '$bases' },
            centerOfGravity: { $first: '$centerOfGravity' },
            location: { $first: '$location' },
            roping: { $first: '$roping' },
            sheaves: { $push: '$sheaves' },
            type: { $first: '$type' },
         },
      },
      { $project: { location: 0, roping: 0, type: 0, 'sheaves.limits': 0 } },
      { $sort: { name: 1 } },
   ];
};
