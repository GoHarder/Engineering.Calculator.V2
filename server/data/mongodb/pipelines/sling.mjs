/**
 * @module sling The sling aggregation pipelines
 */

/** The aggregation for the sling top channels with gussets */
export const _topChannels = [
   { $match: { material: 'ASTM A36', depth: { $gte: 6 }, shape: 'channel' } },
   { $sort: { _nameSort: 1, depth: 1 } },
   { $unset: ['_nameSort', '_stockStatusSort'] },
   { $lookup: { from: 'sling_gussets', localField: 'depth', foreignField: 'channelDepth', as: 'slingGusset' } },
   { $unwind: { path: '$slingGusset' } },
   { $project: { _id: 0, area: 0, flangeThickness: 0, inertiaY: 0, material: 0, modulusY: 0, 'slingGusset._id': 0, 'slingGusset.channelDepth': 0, webThickness: 0 } },
];
