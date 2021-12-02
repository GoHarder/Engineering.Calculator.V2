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
      { $addFields: { _sort: { $filter: { input: '$opened', as: 'user', cond: { $eq: ['$$user._id', _id] } } } } },
      { $unwind: { path: '$_sort' } },
      { $addFields: { _sort: '$_sort.date' } },
      { $sort: { _sort: -1 } },
      { $project: { carNo: 1, contract: 1, created: 1, creator: 1, customer: 1, jobName: 1, layout: 1, opened: 1 } },
      { $skip: skip },
      { $limit: limit },
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
      { $project: { carNo: 1, contract: 1, created: 1, creator: 1, customer: 1, jobName: 1, layout: 1, opened: 1, score: { $meta: 'searchScore' } } },
      { $skip: skip },
      { $limit: limit },
   ];
};
