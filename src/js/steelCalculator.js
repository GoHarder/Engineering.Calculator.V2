import fetchStore from '../svelte/stores/fetch';
import { clone } from 'lib/main.mjs';
import { round, roundInc, solveCubic } from 'lib/math.mjs';

let data = undefined;

let cache = {};

// Getting steel data
const getData = async () => {
   const token = localStorage.getItem('token');

   if (token) {
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/overhead-steel`, {
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

   if (!str.match(/x(\^\d)?/g)) return `${str}*x`;
   if (str === 'x') str = '1*x';

   // Break down string
   const sign = str.match(/-/g)?.[0] ?? '';
   let number = str.match(/(\d+(\.\d+)?)/g)[0];
   let exponent = parseInt(str.match(/\^(\d+)/)?.[1]) + 1 || 2;
   number = nerdamer(`${number}/${exponent}`).text();
   nerdamer.clear('all');

   return `${sign}${number}x^${exponent}`;
};

const integrate = (sections, nth = 0) => {
   const cStep = sections.length * nth;

   return sections.map((section, i) => {
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
      const output = [
         { length: 0, weight: 0 },
         { length: this.lengthRb, weight: 0 },
      ];

      // Sanitize the member input
      if (!member) return output;

      // Sanitize loads input
      this.#_loads = clone(this.loads).reduce(
         (table, load, i) => {
            // Build a table to sort and combine the loads
            // - The length is made into a integer so the table has a natural sort
            const key = round(load.length, 5) * 100000;

            if (!table[key]) table[key] = { length: load.length, weight: 0 };

            // table[key].weight += load.weight;
            table[key].weight += load.deadLoad + load.liveLoad;

            if (i !== this.loads.length - 1) return table;

            // Once the table is built return the table as an array
            return Object.keys(table).map((key) => {
               table[key].weight *= -1;
               return table[key];
            });
         },
         this.loads.length === 0 ? [] : {}
      );

      const distLoad = { length: roundInc(this.length / 2), weight: this.length * member.weight };

      const sums = [...this.#_loads, distLoad].reduce(
         (table, load) => {
            table.forces += Math.abs(load.weight);
            table.moments += load.length * Math.abs(load.weight);

            return table;
         },
         { forces: 0, moments: 0 }
      );

      const rB = round(sums.moments / (this.lengthRb || 1), 2);
      const rA = round(sums.forces - rB, 2);

      output[0].weight = rA;
      output[1].weight = rB;

      return output;
   }

   #getShearSections(member, reactions) {
      const sections = [];

      if (!member) return sections;

      // Prepare the loads for processing
      const loads = [...reactions, ...this.#_loads].sort((loadA, loadB) => loadA.length - loadB.length);

      if (loads[loads.length - 1].length !== this.length) loads.push({ length: this.length, weight: -1 });

      // Create the sections
      for (let i = 0; i < loads.length - 1; i++) {
         const formula = `-${member.weight}*x+${round(weightSum(loads, i))}`;
         const min = loads[i].length;
         const max = loads[i + 1].length;
         let support = -1;
         if (loads[i].weight >= 0) support = loads[i].length;
         if (loads[i + 1].weight >= 0) support = loads[i + 1].length;
         sections.push({ min, max, support, formula });
      }

      return sections;
   }

   #getMomentSections(sections) {
      const output = integrate(sections);
      const memo = {};
      let max = '=0';

      for (let i = 0; i < output.length; i++) {
         const section = output[i];

         let min = `${nerdamer(section.formula, { x: section.min }).text()}${max}`;
         max = `=${nerdamer(section.formula, { x: section.max }).text()}`;
         min = nerdamer(min, memo);

         const key = `c${i + 1}`;
         memo[key] = min.solveFor(key);

         section.formula = nerdamer(section.formula, memo).text();
      }

      nerdamer.clear('all');
      return output;
   }

   #getMaxMoment(sections) {
      let max = 0;

      for (let i = 0; i < this.length + 1; i++) {
         const section = sections.find((sect) => i <= sect.max);
         const moment = nerdamer(section.formula, { x: i }).text();
         if (Math.abs(parseFloat(moment)) > max) max = Math.abs(moment);
      }

      return max;
   }

   #getSlopeFormulas(sections) {
      const newSections = integrate(sections);
      const boundaries = [];
      let max = '=0';

      for (let i = 0; i < newSections.length; i++) {
         const section = newSections[i];
         const min = `${nerdamer(section.formula, { x: section.min }).text()}${max}`;
         max = `=${nerdamer(section.formula, { x: section.max }).text()}`;
         boundaries.push(min);
      }

      boundaries.shift();

      nerdamer.clear('all');
      return { sections: newSections, boundaries };
   }

   #getDeflectFormulas(sections) {
      const newSections = integrate(sections, 1);
      let boundaries = [];
      const solved = [];
      let max = '=0';

      for (let i = 0; i < newSections.length; i++) {
         const section = newSections[i];

         const min = `${nerdamer(section.formula, { x: section.min }).text()}${max}`;
         max = `=${nerdamer(section.formula, { x: section.max }).text()}`;

         if (section.min === section.support) {
            solved.push(min);
         }

         if (section.max === section.support) {
            max = `0${max}`;
            solved.push(max);
         }

         if (section.min !== section.support) {
            boundaries.push(min);
         }
      }

      nerdamer.clear('all');
      return { sections: newSections, boundaries: [...solved, ...boundaries] };
   }

   #solveConstants(formulas) {
      const output = {};
      let formula2 = undefined;
      let constants2 = [];

      for (let i = 0; i < formulas.length; i++) {
         let formula1 = formulas[i];

         const constants1 = formula1.match(/c\d+/g);

         if (!constants1) continue;

         // Solve simple equations c5 = 0
         if (constants1.length === 1) {
            const key = constants1[0];
            const value = nerdamer(formula1).solveFor(key).toString();
            output[key] = value;

            // Remove solved equations
            formulas.splice(i, 1);
            formulas = formulas.map((formula) => nerdamer(formula, output).text());

            // Reset loop
            i = -1;
            continue;
         }

         // If there isn't a simple formula find one with 3 constants
         if (constants1.length === 3 && !formula2) {
            formula2 = formula1;
            constants2 = constants1;

            // Reset loop
            i = -1;
            continue;
         }

         if (!formula2) continue;

         // Find a formula with 2 similar constants
         const test = [...new Set([...constants1, ...constants2])];

         if (test.length === 3 && formula1 !== formula2) {
            let solveVar = formula2.match(/c\d+/g)[0];
            formula1 = nerdamer(formula1).solveFor(solveVar);
            formula2 = nerdamer(formula2).solveFor(solveVar);

            formula1 = `${formula1.toString()}=${formula2.toString()}`;
            formula2 = undefined;
            constants2 = [];

            solveVar = formula1.match(/c\d+/g).find((c, i, array) => {
               const others = [...array];
               others[i] = undefined;
               return !others.includes(c);
            });

            const value = nerdamer(formula1).solveFor(solveVar).toString();
            output[solveVar] = value;

            // Update formulas
            formulas = formulas.map((formula) => nerdamer(formula, output).text());

            // Reset loop
            i = -1;
            continue;
         }
      }

      return output;
   }

   #getPossibleXs(sections, constants) {
      const results = sections.reduce((array, section) => {
         let formula = nerdamer(`${section.formula}`, constants);
         formula = formula.toString().replace(/(x\^?\d?)/g, '$1 ');

         const variables = formula.split(' ').reduce((output, chunk) => {
            chunk = chunk.replace(/[\(\)\+]/g, '');
            let key = 'd';

            if (chunk.includes('*x^3')) {
               key = 'a';
               chunk = chunk.replace(/\*x\^3/, '');
            }

            if (chunk.includes('*x^2')) {
               key = 'b';
               chunk = chunk.replace(/\*x\^2/, '');
            }

            if (chunk.includes('*x')) {
               key = 'c';
               chunk = chunk.replace(/\*x/, '');
            }

            chunk = chunk.split('/');
            output[key] = parseInt(chunk[0]) / (parseInt(chunk[1]) || 1);

            return output;
         }, {});

         let answers = solveCubic(variables.a, variables.b, variables.c, variables.d);

         answers = answers.filter((x) => section.min <= x && x <= section.max);

         array = [...array, ...answers];

         return array;
      }, []);

      return [0, ...results, this.length];
   }

   #getMaxDeflection(sections, possibleXs, constants, member) {
      let max = 0;
      let inertia = this.axis === 'x' ? member.inertiaX : member.inertiaY;

      for (let i = 0; i < possibleXs.length; i++) {
         let x = round(possibleXs[i], 2);
         const section = sections.find((section) => possibleXs[i] <= section.max);
         const formula = nerdamer(section.formula, { ...constants, x });
         let answer = formula.toString().split('/');
         answer = round(parseInt(answer[0]) / parseInt(answer[1] || '1'), 5);

         if (Math.abs(answer) > Math.abs(max)) max = answer;
      }

      return round(max / (29 * 10 ** 6 * inertia), 5);
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

      for (let i = 0; i < this.steel.length; i++) {
         const member = this.steel[i];
         if (this.length === 0) {
            output.push(JSON.stringify(member));
            continue;
         }

         const reactions = this.#getReactions(member);
         const shearSections = this.#getShearSections(member, clone(reactions));
         const momentSections = this.#getMomentSections(clone(shearSections));
         const maxMoment = this.#getMaxMoment(clone(momentSections));

         const reqSectionModulus = round(maxMoment / (this.existing ? 17600 : 19300), 2);
         const sectionModulus = this.axis === 'x' ? member.modulusX : member.modulusY;

         // If member doesn't meet section modulus move on
         if (sectionModulus <= reqSectionModulus) continue;

         const slopeFormulas = this.#getSlopeFormulas(clone(momentSections));
         const deflectFormulas = this.#getDeflectFormulas(clone(slopeFormulas.sections));
         const constants = this.#solveConstants([...clone(slopeFormulas.boundaries), ...clone(deflectFormulas.boundaries)]);
         const possibleXs = this.#getPossibleXs(clone(slopeFormulas.sections), constants);
         const maxDeflection = this.#getMaxDeflection(clone(deflectFormulas.sections), possibleXs, constants, member);

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

   static sortOptions(...opts) {
      opts = opts.filter((x) => x.length > 0);

      if (opts.length > 1) {
         opts = opts.reduce((array, opt) => {
            array = [...array, ...opt];
            return array;
         }, []);

         const hashTable = {};
         const duplicates = [];

         opts.forEach((item) => {
            if (hashTable[item]) {
               if (hashTable[item] === 1) {
                  duplicates.push(item);
               }
               hashTable[item] = hashTable[item] + 1;
            } else {
               hashTable[item] = 1;
            }
         });

         opts = duplicates;
      } else {
         opts = opts[0];
      }

      if (!opts) return [];

      opts = opts.map((opt) => JSON.parse(opt));

      return opts.sort((a, b) => {
         if (b.depth === a.depth) return a.weight - b.weight;
         return a.depth - b.depth;
      });
   }
}
