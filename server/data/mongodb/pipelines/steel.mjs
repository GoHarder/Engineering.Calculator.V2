/**
 * @module steel The steel aggregation pipelines
 */

/**
 * Gets steel by search query
 * @param {string} query The search query
 * @param {number} skip How many documents to skip
 * @param {number} limit How many documents to return
 */
export const bySearch = (query, skip, limit) => {
   return [{ $search: { autocomplete: { query: query, path: 'name' } } }, { $project: { _id: 1, name: 1, stockStatus: 1, material: 1 } }, { $skip: skip }, { $limit: limit }];
};
