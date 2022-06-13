/**
 * @module projects The project aggregation pipelines
 */

/**
 * Creates an aggregation to find the recent documents of a user
 * @param {string} _id The users id
 * @param {number} skip How many documents to skip
 * @param {number} limit How many documents to return
 */
export const byRecentlyOpened = (_id, skip, limit) => {
   return [
      { $match: { 'opened._id': _id } },
      { $set: { _sort: { $first: { $filter: { input: '$opened', cond: { $eq: ['$$this._id', _id] } } } } } },
      { $set: { _sort: '$_sort.date' } },
      { $unset: ['globals', 'metric', 'modules', 'notes', 'temp'] },
      { $sort: { _sort: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $unset: '_sort' },
   ];
};

/**
 * Creates an aggregation to find the recent documents of a user
 * @param {string} search The search string
 * @param {number} skip How many documents to skip
 * @param {number} limit How many documents to return
 */
export const bySearch = (search, skip, limit) => {
   return [
      {
         $search: {
            compound: {
               should: [
                  { autocomplete: { query: search, path: 'carNo' } },
                  { autocomplete: { query: search, path: 'contract' } },
                  { autocomplete: { query: search, path: 'creator.firstName' } },
                  { autocomplete: { query: search, path: 'creator.lastName' } },
                  { autocomplete: { query: search, path: 'customer' } },
                  { autocomplete: { query: search, path: 'jobName' } },
                  { autocomplete: { query: search, path: 'layout' } },
               ],
               minimumShouldMatch: 1,
            },
         },
      },
      { $set: { score: { $meta: 'searchScore' } } },
      { $unset: ['globals', 'metric', 'modules', 'notes', 'temp'] },
      { $skip: skip },
      { $limit: limit },
   ];
};
