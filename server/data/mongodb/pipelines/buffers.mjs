/**
 * @module buffers The buffers aggregation pipelines
 */

import { average, round } from '../../../../lib/math.mjs';

/**
 * Creates an aggregation for oil buffers
 * @param {number} load The load on the buffers
 * @param {number} speed The speed the buffer will be hit by
 */
export const getOilBuffers = (load, speed) => {
   return [
      { $unwind: { path: '$applications' } },
      { $match: { maxSpeed: { $gte: speed }, $and: [{ 'applications.minLoad': { $lte: load } }, { 'applications.maxLoad': { $gte: load } }] } },
      { $sort: { name: 1, 'applications.qty': 1 } },
      {
         $group: {
            _id: '$_id',
            name: { $first: '$name' },
            stroke: { $first: '$stroke' },
            height: { $first: '$height' },
            applications: { $push: '$applications' },
            minQty: { $first: '$applications.qty' },
            maxQty: { $last: '$applications.qty' },
         },
      },
      { $sort: { name: 1 } },
   ];
};

/**
 * Creates an aggregation for buffer springs
 * @param {number} minLoad The minimum load for all buffers
 * @param {number} maxLoad The maximum load for all buffers
 * @param {number} speed The rated speed the buffer will be hit at
 */
export const getBufferSprings = (minLoad, maxLoad, speed) => {
   return [
      { $unwind: { path: '$applications' } },
      { $match: { 'applications.maxSpeed': { $gte: speed }, $and: [{ 'applications.load': { $gte: minLoad } }, { 'applications.load': { $lte: maxLoad } }] } },
      { $addFields: { difference: { $abs: { $subtract: [round(average([minLoad, maxLoad])), '$applications.load'] } } } },
      { $sort: { difference: 1, 'applications.qty': 1, 'applications.compression': -1 } },
      {
         $group: {
            _id: '$_id',
            name: { $first: '$name' },
            height: { $first: '$height' },
            loadPerInch: { $first: '$loadPerInch' },
            applications: { $push: '$applications' },
            calculated: { $first: '$applications' },
            compression: { $addToSet: '$applications.compression' },
         },
      },
      { $project: { _id: 0, 'applications.maxSpeed': 0, 'calculated.maxSpeed': 0 } },
      { $sort: { name: 1 } },
   ];
};
