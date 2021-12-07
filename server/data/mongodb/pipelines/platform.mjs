/**
 * @module platform The platform aggregation pipelines
 */

/** The aggregation for platform angle */
export const _angle = [
   { $match: { shape: 'angle', material: 'ASTM A36', name: { $in: ['L3X3X1/4', 'L3X3X3/8', 'L3X3X1/2', 'L4X4X3/8', 'L4X4X1/2'] } } },
   { $unset: '_stockStatusSort' },
   { $project: { _id: 0, area: 0, inertiaX: 0, inertiaY: 0, material: 0, modulusY: 0, shape: 0, width: 0, webThickness: 0 } },
];
