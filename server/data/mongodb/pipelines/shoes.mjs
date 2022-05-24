/**
 * @module shoes The shoe aggregation pipelines
 */

/**
 * Creates an aggregation for shoes
 * @param {number} capacity The max capacity of the shoe
 * @param {number} carSpeed The max speed of the shoe
 */
export const getShoes = (capacity, carSpeed) => {
   return [
      { $match: { maxCapacity: { $gte: capacity }, maxSpeed: { $gte: carSpeed } } },
      { $sort: { _manufacturerSort: 1 } },
      { $unset: '_manufacturerSort' },
      { $project: { manufacturer: 0, maxCapacity: 0, maxSpeed: 0 } },
   ];
};
