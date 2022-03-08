import fetchStore from '../svelte/stores/fetch';
import { clone } from 'lib/main.mjs';
import { round, roundInc } from 'lib/math.mjs';

let data = undefined;

let cache = {};

// Getting steel data
const getData = async () => {
   const token = localStorage.getItem('token');

   if (token) {
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/overhead-steel?supplied=true`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         data = clone(body);
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   } else {
      setTimeout(() => {
         getData();
      }, 5000);
   }
};

(function () {
   getData();
})();

// Algebra helper functions
const weightSum = (sections, i) => {
   return sections
      .slice(0, i + 1)
      .sort((a, b) => b.weight - a.weight)
      .reduce((sum, force) => (sum += force.weight), 0);
};

const intTerm = (str) => {
   str = str.trim();

   const hasX = str.match(/x(\^\d)?/g);
   if (!hasX) return `${str}*x`;

   let exponent = str.match(/\d$/g);

   if (!exponent) str += '^1';

   exponent = exponent ? parseInt(exponent) : 1;

   str = str.replace(/\d$/, `${exponent + 1}`);

   let convert = algebra.parse(`(${str})/${exponent + 1}`);

   convert = convert.toString();

   return convert;
};

const integrate = (sections, nth = 0) => {
   const cStep = sections.length * nth;

   const copy = clone(sections);

   return copy.map((section, i) => {
      section.formula = section.formula.replace(/\s-\s/g, ' + -');

      const terms = section.formula.split('+').map((term) => intTerm(term));

      const c = `c${i + 1 + cStep}`;

      section.formula = `${terms.join(' + ')} + ${c}`;

      section.formula = section.formula.replace(/\s\+\s\-/g, ' - ');

      return section;
   });
};

// The main class export
export default class SteelCalculator {
   #_loads;
   #_steel;

   constructor() {
      this.steel = [];
      this.length = 0;
      this.lengthRb = 0;
      this.loads = [];
      this.axis = 'x';
      this.existing = false;
   }

   // Private Methods
   #getReactions(member) {
      this.#_loads = clone(this.loads).filter((load) => load.length !== 0 && load.weight !== 0);

      const distLoad = { length: roundInc(this.length / 2), weight: this.length * (member?.weight ?? 0) };
      const sumOfForces = [...this.#_loads, distLoad].reduce((total, load) => total + load.weight, 0);
      const sumOfMoments = [...this.#_loads, distLoad].reduce((total, load) => total + load.weight * load.length, 0);

      const rB = round(sumOfMoments / (this.lengthRb || 1), 2);
      const rA = round(sumOfForces - rB, 2);

      return [
         { length: 0, weight: rA },
         { length: this.lengthRb, weight: rB },
      ];
   }

   #getShearFormulas(member, reactions) {
      // Prepare the loads for processing
      let temp = clone(this.#_loads).map((load) => {
         load.weight *= -1;
         return { length: load.length, weight: load.weight };
      });

      temp = [reactions[0], ...temp, reactions[1]];

      temp = temp.sort((loadA, loadB) => loadA.length - loadB.length);

      if (temp[temp.length - 1].length !== this.length) temp.push({ length: this.length, weight: -1 });

      // Create the sections
      const sections = [];

      for (let i = 0; i < temp.length - 1; i++) {
         const formula = `-${member.weight}x + ${round(weightSum(temp, i))}`;
         const min = temp[i].length;
         const max = temp[i + 1].length;

         let support = -1;
         if (temp[i].weight >= 0) support = temp[i].length;
         if (temp[i + 1].weight >= 0) support = temp[i + 1].length;

         sections.push({ min, max, support, formula });
      }

      return sections;
   }

   #getMomentFormulas(formulas) {
      const output = integrate(formulas);
      const memo = {};
      let max = '0 = ';

      for (let i = 0; i < output.length; i++) {
         const section = output[i];
         const formula = algebra.parse(section.formula);

         const min = `${max}${formula.eval({ x: section.min }).toString()}`;
         max = `${formula.eval({ x: section.max }).toString()} = `;

         const key = `c${i + 1}`;
         const constant = algebra.parse(min).eval(memo).solveFor(key);

         // memo[key] = constant.valueOf();
         memo[key] = constant;
      }

      return output.map((section) => {
         const solved = algebra.parse(section.formula).eval(memo).toString();
         section.formula = solved;
         return section;
      });
   }

   #getMax(formulas) {
      let max = 0;

      for (let i = 0; i < this.length + 1; i++) {
         const section = formulas.find((sect) => i <= sect.max);
         const formula = algebra.parse(`m = ${section.formula}`);
         const moment = formula.eval({ x: i }).solveFor('m').valueOf();

         if (Math.abs(moment) > max) max = Math.abs(moment);
      }

      return max;
   }

   #getSlopeFormulas(formulas) {
      const sections = integrate(formulas);
      const boundaries = [];
      let max = '0 = ';

      for (let i = 0; i < sections.length; i++) {
         const section = sections[i];
         const formula = algebra.parse(section.formula);

         let min = `${max}${formula.eval({ x: section.min }).toString()}`;
         max = `${formula.eval({ x: section.max }).toString()} = `;

         boundaries.push(min);
      }

      boundaries.shift();

      return { sections, boundaries };
   }

   #getDeflectFormulas(formulas) {
      const sections = integrate(formulas, 1);
      let boundaries = [];
      const solved = [];
      let max = '';

      for (let i = 0; i < sections.length; i++) {
         const section = sections[i];
         const formula = algebra.parse(section.formula);

         let min = `${max}${formula.eval({ x: section.min }).toString()}`;
         max = `${formula.eval({ x: section.max }).toString()} = `;

         if (section.min === section.support) {
            min += ' = 0';
            solved.push(min);
         } else {
            if (min.match(/=\s0/) === null) {
               if (min.match(/^c\d+$/) !== null) min += ' = 0';

               boundaries.push(min);
            }
         }

         if (section.max === section.support) {
            max += '0';
            solved.push(max);
         }
      }

      boundaries = [...solved, ...boundaries];

      return { sections, boundaries };
   }

   #solveConstants(formulas) {
      const output = {};
      let hardFormula = '';
      let hardConstants = [];

      // NOTE: 3-04-2022 4:30 PM - Debug this loop
      for (let i = 0; i < formulas.length; i++) {
         const formula = formulas[i];
         const constants = formula.match(/c\d+/g);

         if (!constants) continue;

         // Solve simple equations c5 = 0
         if (constants.length === 1) {
            const key = constants[0];
            const fraction = algebra.parse(formula).solveFor(key);
            // output[key] = fraction.valueOf();
            output[key] = fraction;

            // Remove solved equations
            formulas.splice(i, 1);

            // Update the equations
            formulas = formulas.map((formula) => algebra.parse(formula).eval(output).toString());

            // Reset loop
            i = -1;
            continue;
         }

         // If there isn't a simple formula find one with 3 constants
         if (constants.length === 3 && !hardFormula) {
            hardFormula = formula;
            hardConstants = constants;

            // Reset loop
            i = -1;
            continue;
         }

         // Find a formula with 2 similar variables
         let test = [...hardConstants, ...constants];
         test = [...new Set(test)];

         if (test.length === 3 && hardFormula) {
            let copy = formula;
            let solveVar = hardFormula.match(/c\d+/g)[0];
            hardFormula = algebra.parse(hardFormula).solveFor(solveVar).toString();
            copy = algebra.parse(copy).solveFor(solveVar).toString();

            const reduction = `${hardFormula} = ${copy}`;
            solveVar = reduction.match(/c\d+/g)[1];
            const fraction = algebra.parse(reduction).solveFor(solveVar);
            output[solveVar] = fraction.valueOf();

            // Update the equations
            formulas = formulas.map((formula) => algebra.parse(formula).eval(output).toString());

            // Reset search
            hardFormula = '';
            hardConstants = [];

            // Reset loop
            i = -1;
            continue;
         }
      }

      return output;
   }

   #getPossibleX(formulas) {
      const ends = [0, this.length];

      const results = clone(formulas).reduce((array, section) => {
         let x = algebra.parse(`0 = ${section.formula}`).solveFor('x');

         x = x.filter((num) => num >= section.min && num <= section.max);

         if (x.length > 0) array.push(round(x[0], 1));

         return array;
      }, []);

      return [...ends, ...results];
   }

   #getMaxDeflection(x, formulas, member) {
      let max = 0;
      let inertia = this.axis === 'x' ? member.inertiaX : member.inertiaY;

      for (let i = 0; i < x.length; i++) {
         const solveFor = algebra.parse(`${x[i]}`);
         let formula = formulas.find((section) => x[i] <= section.max).formula;

         formula = algebra.parse(`d = ${formula}`).eval({ x: solveFor }).solveFor('d');

         if (formula.valueOf() < max) {
            max = round(formula.valueOf(), 3);
         }
      }

      return round(max / (29 * 10 ** 6 * inertia), 4);
   }

   #getCacheKey() {
      if (this.#_loads) {
         const loadString = this.#_loads.reduce((string, load) => {
            string += `-(${load.length}x${load.weight})`;
            return string;
         }, '');

         return `${this.#_steel}${loadString}-(${this.lengthRb}x${this.length})-${this.axis}-${this.existing ? 1 : 0}`;
      }
   }

   // Public Methods
   get options() {
      const key = this.#getCacheKey();

      if (key in cache) return cache[key];

      const testDeflection = round((this.length / 1666) * -1, 4);
      let output = [];

      if (this.length === 0) return output;

      for (let i = 0; i < this.steel.length; i++) {
         const member = this.steel[i];
         const reactions = this.#getReactions(member);
         const shearFormulas = this.#getShearFormulas(member, clone(reactions));
         const momentFormulas = this.#getMomentFormulas(clone(shearFormulas));
         const maxMoment = this.#getMax(clone(momentFormulas));

         const reqSx = round(maxMoment / (this.existing ? 17600 : 19300), 2);
         const testSx = this.axis === 'x' ? member.modulusX : member.modulusY;

         // If member doesn't meet section modulus move on
         if (testSx <= reqSx) continue;

         let slopeFormulas = this.#getSlopeFormulas(clone(momentFormulas));
         let deflectFormulas = this.#getDeflectFormulas(clone(slopeFormulas.sections));

         const constants = this.#solveConstants([...clone(slopeFormulas.boundaries), ...clone(deflectFormulas.boundaries)]);

         slopeFormulas = slopeFormulas.sections.map((section) => {
            section.formula = algebra.parse(section.formula).eval(constants).toString();
            return section;
         });

         deflectFormulas = deflectFormulas.sections.map((section) => {
            section.formula = algebra.parse(section.formula).eval(constants).toString();
            return section;
         });

         const x = this.#getPossibleX(slopeFormulas);

         const maxDeflection = this.#getMaxDeflection(x, deflectFormulas, member);

         // If member doesn't meet deflection move on
         if (testDeflection >= maxDeflection) continue;

         output.push(JSON.stringify(member));
      }

      // Stash results in cache
      if (key) cache[key] = output;

      return output;
   }

   set shape(key) {
      if (key in data) {
         this.steel = clone(data[key]);
         this.#_steel = key;
      } else {
         this.steel = [];
      }
   }

   set name(name) {
      if (name) {
         const doc = this.steel.find((doc) => doc.name === name);

         if (doc) {
            this.member = doc;
         } else {
            this.member = {};
         }
      }
   }

   get rA() {
      return this.#getReactions(this.member)[0]?.weight ?? 0;
   }

   get rB() {
      return this.#getReactions(this.member)[1]?.weight ?? 0;
   }
}
