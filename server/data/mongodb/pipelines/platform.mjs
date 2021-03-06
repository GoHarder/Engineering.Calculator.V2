/**
 * @module platform The platform aggregation pipelines
 */

/** The aggregation for platform angle */
export const _angle = [
   { $match: { shape: 'angle', material: 'ASTM A36', name: { $in: ['L3X3X1/4', 'L3X3X3/8', 'L3X3X1/2', 'L4X4X3/8', 'L4X4X1/2'] } } },
   { $unset: ['_stockStatusSort', 'area', 'inertiaX', 'inertiaY', 'material', 'modulusY', 'shape', 'width'] },
];

const channels = [
   'C4X5.4',
   'C5X6.7',
   'C6X8.2',
   'C7X9.8',
   'C8X11.5',
   'C9X13.4',
   'C10X15.3',
   'C12X20.7',
   'C15X33.9',
   'MC4X13.8',
   'MC6X12',
   'MC6X15.3',
   'MC8X18.7',
   'MC8X22.8',
   'MC10X28.5',
   'MC12X31',
];

/**
 * Creates an aggregation for platform channel
 * @param {string} steelType The type of steel
 */
export const getChannel = (steelType) => {
   return [
      { $match: { shape: 'channel', material: steelType } },
      { $set: { _specialSort: { $cond: [{ $in: ['$name', channels] }, 0, 1] } } },
      { $sort: { _specialSort: 1, _nameSort: 1 } },
      { $unset: ['_nameSort', '_specialSort', '_stockStatusSort', 'area', 'flangeThickness', 'gage', 'inertiaY', 'material', 'modulusY', 'shape', 'webThickness'] },
   ];
};
