import { round, radians, sin, cos } from 'lib/math.mjs';

export const sheaveGrooves = [
   { name: 'GRVH-TUU-0900', description: '(90° U)', customer: false, frictionCoefficient: 0.08, grooveAngle: 28, shape: 'U', undercutAngle: 90 },
   { name: 'GRVH-TUU-0950', description: '(95° U)', customer: false, frictionCoefficient: 0.08, grooveAngle: 28, shape: 'U', undercutAngle: 95 },
   { name: 'GRVH-TUU-0970', description: '(97° U)', customer: false, frictionCoefficient: 0.08, grooveAngle: 28, shape: 'U', undercutAngle: 97 },
   { name: 'GRVH-TUU-1000', description: '(100° U)', customer: false, frictionCoefficient: 0.08, grooveAngle: 28, shape: 'U', undercutAngle: 100 },
   { name: 'GRVH-TUU-1050', description: '(105° U)', customer: false, frictionCoefficient: 0.08, grooveAngle: 28, shape: 'U', undercutAngle: 105 },
   { name: 'GRVH-TVU-0450', description: '(45° V)', customer: false, frictionCoefficient: 0.08, grooveAngle: 45, shape: 'V', undercutAngle: 105 },
   { name: 'GRVH-TVU-0360', description: '(36° V)', customer: false, frictionCoefficient: 0.08, grooveAngle: 36, shape: 'V', undercutAngle: 105 },
   { name: 'GRVH-TVU-0300', description: '(30° V)', customer: false, frictionCoefficient: 0.08, grooveAngle: 30, shape: 'V', undercutAngle: 105 },
   { name: 'GRVC-KON-036V', description: '(Kone)', customer: 'Kone' },
   { name: 'GRVC-MEI-040V', description: '(MEI)', customer: 'MEI' },
   { name: 'GRVC-OTI-090U', description: '(Otis)', customer: 'Otis' },
   { name: 'GRVC-SCH-3140', description: '(Schindler)', customer: 'Schindler' },
   { name: 'GRVC-SCH-3269', description: '(Schindler)', customer: 'Schindler' },
   { name: 'GRVC-SCH-4301', description: '(Schindler)', customer: 'Schindler' },
   { name: 'GRVC-TKE-036V', description: '(Tyssenkrupp)', customer: 'Tyssenkrupp' },
   { name: 'GRVC-YOK-030V', description: '(Yokohama)', customer: 'Yokohama' },
];

export const availableTraction = {
   V: (frictionCoefficient, arc, grooveAngle) => {
      return round(Math.E ** ((frictionCoefficient / sin(grooveAngle / 2)) * radians(arc)), 4);
   },
   U: (frictionCoefficient, arc, grooveAngle, undercutAngle) => {
      return round(
         Math.E **
            (((frictionCoefficient * 4 * (cos(grooveAngle / 2) - sin(undercutAngle / 2))) /
               (Math.PI - radians(undercutAngle) - radians(grooveAngle) - sin(undercutAngle) + sin(grooveAngle))) *
               radians(arc)),
         4
      );
   },
};

export const specificPressure = {
   V: (ropeTension, grooveAngle, accelerationFactor, ropeQty, ropeSize, sheaveDiameter) => {
      return round(((ropeTension * 1.5 * Math.PI) / (ropeQty * ropeSize * sheaveDiameter * sin(grooveAngle / 2))) * accelerationFactor, 1);
   },
   U: (ropeTension, grooveAngle, accelerationFactor, ropeQty, ropeSize, sheaveDiameter, undercutAngle) => {
      return round(
         ((8 * ropeTension * cos(undercutAngle / 2)) /
            (ropeQty * sheaveDiameter * ropeSize * (radians(180 - grooveAngle) - radians(undercutAngle) + sin(180 - grooveAngle) - sin(undercutAngle)))) *
            accelerationFactor,
         1
      );
   },
};

export const performanceStandards = [
   { speed: 200, acceleration: 1.6 },
   { speed: 500, acceleration: 2 },
   { speed: Infinity, acceleration: 3.2 },
];

export const safetyFactor = [
   { speed: 50, passenger: 7.6, freight: 6.65 },
   { speed: 75, passenger: 7.75, freight: 6.85 },
   { speed: 100, passenger: 7.97, freight: 7.0 },
   { speed: 125, passenger: 8.1, freight: 7.15 },
   { speed: 150, passenger: 8.25, freight: 7.3 },
   { speed: 175, passenger: 8.4, freight: 7.45 },
   { speed: 200, passenger: 8.6, freight: 7.65 },
   { speed: 225, passenger: 8.75, freight: 7.75 },
   { speed: 250, passenger: 8.9, freight: 7.9 },
   { speed: 300, passenger: 9.2, freight: 8.2 },
   { speed: 350, passenger: 9.5, freight: 8.45 },
   { speed: 400, passenger: 9.75, freight: 8.7 },
   { speed: 450, passenger: 10.0, freight: 8.9 },
   { speed: 500, passenger: 10.25, freight: 9.15 },
   { speed: 550, passenger: 10.45, freight: 9.3 },
   { speed: 600, passenger: 10.7, freight: 9.5 },
   { speed: 650, passenger: 10.85, freight: 9.65 },
   { speed: 700, passenger: 11.0, freight: 9.8 },
   { speed: 750, passenger: 11.15, freight: 9.9 },
   { speed: 800, passenger: 11.25, freight: 10.0 },
   { speed: 850, passenger: 11.35, freight: 10.1 },
   { speed: 900, passenger: 11.45, freight: 10.15 },
   { speed: 950, passenger: 11.5, freight: 10.2 },
   { speed: 1000, passenger: 11.55, freight: 10.3 },
   { speed: 1050, passenger: 11.65, freight: 10.35 },
   { speed: 1100, passenger: 11.7, freight: 10.4 },
   { speed: 1150, passenger: 11.75, freight: 10.45 },
   { speed: 1250, passenger: 11.8, freight: 10.5 },
   { speed: 1350, passenger: 11.85, freight: 10.55 },
   { speed: 2000, passenger: 11.9, freight: 10.55 },
];
