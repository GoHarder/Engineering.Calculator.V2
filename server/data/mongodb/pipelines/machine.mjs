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
 * Creates the sheave object in the first set stage
 * @param {number} cb The elevator counterbalance
 * @param {number} speed The machine speed
 * @param {number} capacity The machine capacity
 * @param {number} shaftLoad The sheave shaft load
 */
const setSheaves1 = (cb, speed, capacity, shaftLoad) => {
   let cond = { $gte: ['$$limit.speed', speed] };

   if (cb) cond = { $and: [cond, { $gte: [`$$limit.${cb}`, capacity] }] };

   const limits = { $size: { $filter: { input: '$$sheave.limits', as: 'limit', cond } } };

   const maxSystemLoad = {
      $size: { $filter: { input: '$$sheave.maxSystemLoad', as: 'max', cond: { $and: [{ $gte: ['$$max.speed', speed] }, { $gte: ['$$max.load', shaftLoad] }] } } },
   };

   return {
      $filter: {
         input: '$sheaves',
         as: 'sheave',
         cond: { $let: { vars: { limits, maxSystemLoad }, in: { $and: [{ $gt: ['$$limits', 0] }, { $gt: ['$$maxSystemLoad', 0] }] } } },
      },
   };
};

/**
 * Creates the rope grippers object in the first set stage
 * @param {number} speed The machine speed
 * @param {number} capacity The machine capacity
 * @param {number} roping The elevator roping
 * @param {number} shaftLoad The sheave shaft load
 */
const setRopeGrippers = (speed, capacity, roping) => {
   const ropings = {
      $size: {
         $filter: {
            input: '$$this.ropings',
            cond: {
               $and: [
                  { $eq: ['$$this.roping', roping] },
                  { $gte: ['$$this.maxSpeed', speed] },
                  { $gte: ['$$this.maxCapacity', capacity] },
                  { $lte: ['$$this.minCapacity', capacity] },
               ],
            },
         },
      },
   };

   const selected = { $first: { $filter: { input: '$$this.ropings', cond: { $eq: ['$$this.roping', roping] } } } };

   return {
      $reduce: {
         input: '$ropeGrippers',
         initialValue: [],
         in: {
            $let: {
               vars: { ropings, roping: selected },
               in: {
                  $concatArrays: [
                     '$$value',
                     {
                        $cond: {
                           if: { $gt: ['$$ropings', 0] },
                           then: [{ $mergeObjects: ['$$this', { minLoad: '$$roping.minLoad', maxLoad: '$$roping.maxLoad' }] }],
                           else: [],
                        },
                     },
                  ],
               },
            },
         },
      },
   };
};

/**
 * Creates the bases object in the second set stage
 */
const setBases2 = () => {
   const mount = { $filter: { input: '$bases', as: 'base', cond: { $eq: [{ $type: '$$base.ropeGrippers' }, 'array'] } } };
   const noMount = { $filter: { input: '$bases', as: 'base', cond: { $eq: [{ $type: '$$base.ropeGrippers' }, 'missing'] } } };
   const valid = { $reduce: { input: '$ropeGrippers', initialValue: [], in: { $concatArrays: ['$$value', ['$$this.name']] } } };

   const ropeGrippers = {
      $reduce: {
         input: '$$this.ropeGrippers',
         initialValue: [],
         in: { $concatArrays: ['$$value', { $cond: { if: { $in: ['$$this.name', '$$valid'] }, then: ['$$this.name'], else: [] } }] },
      },
   };

   const $$mount = {
      $reduce: {
         input: '$$mount',
         initialValue: [],
         in: {
            $let: {
               vars: { ropeGrippers },
               in: {
                  $concatArrays: [
                     '$$value',
                     { $cond: { if: { $gt: [{ $size: '$$ropeGrippers' }, 0] }, then: [{ $mergeObjects: ['$$this', { ropeGrippers: '$$ropeGrippers' }] }], else: [] } },
                  ],
               },
            },
         },
      },
   };

   return { $let: { vars: { mount, noMount, valid }, in: { $concatArrays: ['$$noMount', $$mount] } } };
};

/**
 * Creates the sheave object in the second set stage
 * @param {number} cb The elevator counterbalance
 * @param {number} speed The machine speed
 * @param {number} capacity The machine capacity
 */
const setSheaves2 = (cb, speed, capacity) => {
   let cond = { $gte: ['$$limit.speed', speed] };

   if (cb) cond = { $and: [cond, { $gte: [`$$limit.${cb}`, capacity] }] };

   const limits = { $size: { $filter: { input: '$$sheave.limits', as: 'limit', cond } } };

   const coils = { $reduce: { input: '$$limits', initialValue: [], in: { $concatArrays: ['$$value', ['$$this.coil']] } } };

   return { $map: { input: '$sheaves', as: 'sheave', in: { $let: { vars: { limits }, in: { $mergeObjects: ['$$sheave', { coils }] } } } } };
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
export const getMachines = (cb, speed, capacity, type, location, roping, shaftLoad, seismicZone) => {
   // Convert counterbalance
   cb = `capAt${cb.toFixed(3).replace(/0\.(\d{2})(\d)/, '$1_$2')}`;
   cb = ['capAt40_0', 'capAt42_5', 'capAt45_0', 'capAt50_0'].includes(cb) && cb;

   // Set second set stage
   const set2 = { $set: { bases: setBases2() } };

   if (type === 'Gearless') set2.sheaves = setSheaves2();

   // Set third set stage
   const iso = { $filter: { input: '$bases', as: 'base', cond: { $eq: [{ $type: '$$base.isolation' }, 'array'] } } };

   const noIso = { $filter: { input: '$bases', as: 'base', cond: { $eq: [{ $type: '$$base.isolation' }, 'missing'] } } };

   const $$iso = {
      $map: {
         input: '$$iso',
         as: 'base',
         in: {
            $mergeObjects: ['$$base', { isolation: { $filter: { input: '$$base.isolation', as: 'isolation', cond: { $in: [seismicZone, '$$isolation.seismicZone'] } } } }],
         },
      },
   };

   return [
      match(cb, speed, capacity, type, location, roping, shaftLoad),
      { $sort: { name: 1 } },
      {
         $set: {
            sheaves: setSheaves1(cb, speed, capacity, shaftLoad),
            ropeGrippers: setRopeGrippers(speed, capacity, roping),
            bases: { $filter: { input: '$bases', as: 'base', cond: { $in: [location, '$$base.location'] } } },
         },
      },
      set2,
      { $set: { bases: { $let: { vars: { iso, noIso }, in: { $concatArrays: ['$$noIso', $$iso] } } } } },
      { $unset: ['location', 'roping', 'type', 'sheaves.limits', 'sheaves.maxSystemLoad', 'ropeGrippers.ropings', 'bases.location', 'bases.isolation.seismicZone'] },
   ];
};
