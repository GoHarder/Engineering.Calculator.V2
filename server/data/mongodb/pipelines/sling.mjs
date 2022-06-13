/**search
 * @module sling The sling aggregation pipelines
 */

/** The aggregation for the sling channels */
export const _channels = [
   { $match: { material: 'ASTM A36', depth: { $gte: 6 }, shape: 'channel' } },
   { $unset: ['_stockStatusSort', 'area', 'flangeThickness', 'gage', 'inertiaY', 'material', 'modulusY', 'webThickness'] },
   { $sort: { _nameSort: 1, depth: 1 } },
   { $unset: '_nameSort' },
];

/** The aggregation for the sling top channels with gussets */
export const _topChannels = [
   { $match: { material: 'ASTM A36', depth: { $gte: 6 }, shape: 'channel' } },
   { $unset: ['_stockStatusSort', 'area', 'flangeThickness', 'gage', 'inertiaY', 'material', 'modulusY', 'webThickness'] },
   { $sort: { _nameSort: 1, depth: 1 } },
   { $lookup: { from: 'sling_gussets', localField: 'depth', foreignField: 'channelDepth', as: 'slingGusset' } },
   { $set: { slingGusset: { $first: '$slingGusset' } } },
   { $unset: ['_nameSort', 'slingGusset._id', 'slingGusset.channelDepth'] },
];
