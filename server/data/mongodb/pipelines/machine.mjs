/**
 * @module machine The machine aggregation pipelines
 */

/**
 * Creates the match step for the aggregation
 * @param {number} cb The elevator counterbalance
 * @param {number} speed The machine speed
 * @param {number} capacity The machine capacity
 * @param {string} type The machine type
 * @param {string} location The machine location
 * @param {number} roping The elevator roping
 * @param {number} shaftLoad The sheave shaft load
 */
const match = (cb, speed, capacity, type, location, roping, shaftLoad) => {
   const elemMatch1 = { speed: { $gte: speed } };
   const elemMatch2 = { speed: { $gte: speed }, load: { $gte: shaftLoad } };

   if (cb) elemMatch1[cb] = { $gte: capacity };

   return { $match: { type, location, roping, 'sheaves.limits': { $elemMatch: elemMatch1 }, 'sheaves.maxSystemLoad': { $elemMatch: elemMatch2 } } };
};

/**
 * Filters the limits and the max system loads
 * @param {number} cb The elevator counterbalance
 * @param {number} speed The machine speed
 * @param {number} capacity The machine capacity
 * @param {number} shaftLoad The sheave shaft load
 */
const setSheaves = (cb, speed, capacity, shaftLoad) => {
   const maxSystemLoad = { $filter: { input: '$$sheave.maxSystemLoad', as: 'max', cond: { $and: [{ $gte: ['$$max.speed', speed] }, { $gte: ['$$max.load', shaftLoad] }] } } };
   let cond = { $gte: ['$$limit.speed', speed] };
   8200;
   if (cb) cond = { $and: [{ $gte: ['$$limit.speed', speed] }, { $gte: [`$$limit.${cb}`, capacity] }] };

   const limits = { $filter: { input: '$$sheave.limits', as: 'limit', cond } };

   return { $map: { input: '$sheaves', as: 'sheave', in: { $mergeObjects: ['$$sheave', { maxSystemLoad, limits }] } } };
};

/**
 * Sets the roping for the rope grippers
 * @param {number} roping The elevator roping
 */
const setGrippers1 = (roping) => {
   return {
      $map: {
         input: '$ropeGrippers',
         as: 'ropeGripper',
         in: {
            $mergeObjects: [
               { $unsetField: { input: '$$ropeGripper', field: 'ropings' } },
               { $first: { $filter: { input: '$$ropeGripper.ropings', cond: { $eq: ['$$this.roping', roping] } } } },
            ],
         },
      },
   };
};

/**
 * Creates the match step for the aggregation
 * @param {number} speed The machine speed
 * @param {number} capacity The machine capacity
 * @param {number} shaftLoad The sheave shaft load
 */
const setGrippers2 = (speed, capacity, shaftLoad) => {
   return {
      $filter: {
         input: '$ropeGrippers',
         as: 'gripper',
         cond: {
            $and: [
               { $gte: ['$$gripper.maxSpeed', speed] },
               { $gte: ['$$gripper.maxCapacity', capacity] },
               { $lte: ['$$gripper.minCapacity', capacity] },
               { $gte: ['$$gripper.maxLoad', shaftLoad] },
               { $lte: ['$$gripper.minLoad', shaftLoad] },
            ],
         },
      },
   };
};

const setCoils = {
   $set: {
      sheaves: {
         $map: {
            input: '$sheaves',
            as: 'sheave',
            in: {
               $mergeObjects: ['$$sheave', { coils: { $reduce: { input: '$$sheave.limits', initialValue: [], in: { $concatArrays: [['$$this.coil'], '$$value'] } } } }],
            },
         },
      },
   },
};

/**
 * Creates an aggregation for the machines
 * @param {number} cb The elevator counterbalance
 * @param {number} speed The machine speed
 * @param {number} capacity The machine capacity
 * @param {string} type The machine type
 * @param {string} location The machine location
 * @param {number} roping The elevator roping
 * @param {number} shaftLoad The sheave shaft load
 */
export const getMachines = (cb, speed, capacity, type, location, roping, shaftLoad) => {
   // Convert counterbalance
   cb = `capAt${cb.toFixed(3).replace(/0\.(\d{2})(\d)/, '$1_$2')}`;
   cb = ['capAt40_0', 'capAt42_5', 'capAt45_0', 'capAt50_0'].includes(cb) && cb;

   return [
      match(cb, speed, capacity, type, location, roping, shaftLoad),
      { $set: { sheaves: setSheaves(cb, speed, capacity, shaftLoad), ropeGrippers: setGrippers1(roping) } },
      {
         $set: {
            sheaves: {
               $filter: { input: '$sheaves', as: 'sheave', cond: { $and: [{ $gt: [{ $size: '$$sheave.limits' }, 0] }, { $gt: [{ $size: '$$sheave.maxSystemLoad' }, 0] }] } },
            },
            ropeGrippers: setGrippers2(speed, capacity, shaftLoad),
         },
      },
      type === 'Gearless' ? setCoils : undefined,
      {
         $unset: [
            'location',
            'ropeGrippers.maxCapacity',
            'ropeGrippers.maxLoad',
            'ropeGrippers.maxSpeed',
            'ropeGrippers.minCapacity',
            'ropeGrippers.minLoad',
            'ropeGrippers.roping',
            'roping',
            'sheaves.limits',
            'sheaves.maxSystemLoad',
            'type',
         ],
      },
      { $sort: { name: 1 } },
   ].filter((step) => step);
};

// console.log(JSON.stringify(getMachines(0.45, 900, 1500, 'Geared', 'Overhead', 1, 8200), null, 3));

// export const getMachines = (counterbalance, speed, capacity, type, location, roping, shaftLoad) => {
//    const cbKey = `capAt${counterbalance.toFixed(3).replace(/0\.(\d{2})(\d)/, '$1_$2')}`;

//    const validCB = ['capAt40_0', 'capAt42_5', 'capAt45_0', 'capAt50_0'].includes(cbKey);

//    const match = { speed: { $gte: speed } };

//    let cond = { $gte: ['$$limit.speed', speed] };

//    if (validCB) {
//       match[cbKey] = { $gte: capacity };
//       cond = { $and: [cond, { $gte: [`$$limit.${cbKey}`, capacity] }] };
//    }

//    return [
//       { $unwind: { path: '$sheaves' } },
//       {
//          $match: {
//             type,
//             location,
//             roping,
//             'sheaves.limits': { $elemMatch: match },
//             'sheaves.maxSystemLoad': { $elemMatch: { speed: { $gte: speed }, load: { $gte: shaftLoad } } },
//          },
//       },
//       { $unwind: { path: '$ropeGrippers' } },
//       {
//          $addFields: {
//             // 'sheaves.limits': { $filter: { input: '$sheaves.limits', as: 'limit', cond } },
//             'ropeGrippers.ropings': { $filter: { input: '$ropeGrippers.ropings', as: 'nth', cond: { $eq: ['$$nth.roping', 1] } } },
//          },
//       },
//       {
//          $project: {
//             _id: 1,
//             name: 1,
//             bases: 1,
//             centerOfGravity: 1,
//             ropeGrippers: {
//                name: 1,
//                maxCapacity: { $first: '$ropeGrippers.ropings.maxCapacity' },
//                maxLoad: { $first: '$ropeGrippers.ropings.maxLoad' },
//                maxSpeed: { $first: '$ropeGrippers.ropings.maxSpeed' },
//                minCapacity: { $first: '$ropeGrippers.ropings.minCapacity' },
//                minLoad: { $first: '$ropeGrippers.ropings.minLoad' },
//                outToOut: 1,
//                weight: 1,
//             },
//             sheaves: 1,
//          },
//       },
//       {
//          $group: {
//             _id: '$_id',
//             name: { $first: '$name' },
//             bases: { $first: '$bases' },
//             centerOfGravity: { $first: '$centerOfGravity' },
//             ropeGrippers: { $addToSet: '$ropeGrippers' },
//             sheaves: { $addToSet: '$sheaves' },
//          },
//       },
//       {
//          $addFields: {
//             ropeGrippers: {
//                $filter: {
//                   input: '$ropeGrippers',
//                   as: 'nth',
//                   cond: { $and: [{ $gte: ['$$nth.maxSpeed', speed] }, { $gte: ['$$nth.maxCapacity', capacity] }, { $lte: ['$$nth.minCapacity', capacity] }] },
//                },
//             },
//          },
//       },
//       {
//          $project: {
//             _id: 1,
//             name: 1,
//             bases: 1,
//             centerOfGravity: 1,
//             ropeGrippers: { name: 1, maxLoad: 1, minLoad: 1, outToOut: 1, weight: 1 },
//             sheaves: { diameter: 1, maxGroovePressure: 1, name: 1, rimWidth: 1 },
//          },
//       },
//       { $sort: { name: 1 } },
//    ];
// };
