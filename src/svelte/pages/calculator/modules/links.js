import { capitalize } from 'lib/string.mjs';

const inheritance = {
   // Platform
   apta: ['platform', 'sling'],
   cabWeight: ['platform', 'sling'],
   cabWidth: ['platform', 'sling'],
   cornerPost: ['platform', 'sling'],
   door1Weight: ['platform', 'sling'],
   door2Weight: ['platform', 'sling'],
   platformDepth: ['platform', 'sling'],
   platformFrontToRail: ['platform', 'sling'],
   platformIsolation: ['platform', 'sling'],
   platformThickness: ['platform', 'sling'],
   platformWeight: ['platform', 'sling'],
   platformWidth: ['platform', 'sling'],
   toeGuard1Weight: ['platform', 'sling'],
   toeGuard2Weight: ['platform', 'sling'],
   // Sling
   carWeight: ['sling', 'counterweight', 'machine', 'buffers'],
   cwtWeight: ['sling', 'counterweight', 'buffers'],
   // Counterweight
   cwtHeight: ['counterweight', 'hoistway'],
   // Machine
   compType: ['machine', 'sling', 'counterweight'],
   compWeight: ['machine', 'sling'],
   ropeSize: ['machine', 'sling'],
   ropeQty: ['machine', 'sling'],
   ropePitch: ['machine', 'sling'],
   o_ropePitch: ['machine', 'sling'],
   // Buffers
   carBufferComp: ['buffers', 'hoistway'],
   carBufferHeight: ['buffers', 'hoistway'],
   carBufferStyle: ['buffers', 'hoistway'],
   cwtBufferComp: ['buffers', 'hoistway'],
   cwtBufferHeight: ['buffers', 'hoistway'],
   terminalSpeed: ['buffers', 'hoistway'],
   cwtBufferStyle: ['buffers', 'hoistway'],
};

class LinkTree {
   constructor(moduleName) {
      this.tree = Object.keys(inheritance).reduce((obj, key) => {
         const index = inheritance[key].findIndex((module) => module === moduleName);
         if (index >= 0) {
            const chain = inheritance[key].slice(0, index);
            if (chain.length > 0) obj[key] = chain;
         }
         return obj;
      }, {});
   }

   setProject(modules) {
      const moduleKeys = Object.keys(modules);

      this.links = Object.keys(this.tree).reduce((obj, key) => {
         const chain = [...this.tree[key], ...moduleKeys].filter((a, i, aa) => aa.indexOf(a) === i && aa.lastIndexOf(a) !== i);

         if (chain.length > 0) obj[key] = `/Calculator/${capitalize(chain[0])}`;

         return obj;
      }, {});
   }

   get(variable) {
      return this.links?.[variable];
   }
}

export const BufferLinks = new LinkTree('buffers');
export const CounterweightLinks = new LinkTree('counterweight');
export const HoistwayLinks = new LinkTree('hoistway');
export const MachineLinks = new LinkTree('machine');
export const SlingLinks = new LinkTree('sling');
