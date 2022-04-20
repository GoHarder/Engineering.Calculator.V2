import { capitalize } from 'lib/string.mjs';

const inheritance = {
   // Platform
   apta: ['platform', 'sling'],
   cabHeight: ['platform', 'hoistway'],
   cabWeight: ['platform', 'sling'],
   cabWidth: ['platform', 'sling', 'railBrackets'],
   cornerPost: ['platform', 'sling', 'hoistway'],
   door1Weight: ['platform', 'sling'],
   door2Weight: ['platform', 'sling'],
   platformDepth: ['platform', 'sling', 'railBrackets'],
   platformFrontToRail: ['platform', 'sling', 'railBrackets'],
   platformIsolation: ['platform', 'sling'],
   platformThickness: ['platform', 'sling', 'hoistway'],
   platformWeight: ['platform', 'sling'],
   platformWidth: ['platform', 'sling'],
   toeGuard1Weight: ['platform', 'sling'],
   toeGuard2Weight: ['platform', 'sling'],
   // Sling
   carWeight: ['sling', 'counterweight', 'machine', 'buffers', 'overheadSteel'],
   cenToCenOfShoes: ['sling', 'railBrackets'],
   cwtWeight: ['sling', 'counterweight', 'buffers', 'overheadSteel'],
   sheaveArrangement: ['sling', 'hoistway'],
   sheaveLocation: ['sling', 'hoistway'],
   slingBotChanDepth: ['sling', 'hoistway'],
   slingStrikePlateThick: ['sling', 'hoistway'],
   slingTopChanDepth: ['sling', 'hoistway'],
   underBeamHeight: ['sling', 'hoistway'],
   // Counterweight
   cwtHeight: ['counterweight', 'hoistway'],
   // Machine
   compType: ['machine', 'sling', 'counterweight'],
   compWeight: ['machine', 'sling', 'overheadSteel'],
   ropeSize: ['machine', 'sling'],
   ropeQty: ['machine', 'sling'],
   ropePitch: ['machine', 'sling'],
   totalRopeWeight: ['machine', 'overheadSteel'],
   o_ropePitch: ['machine', 'sling'],
   // Buffers
   carBufferComp: ['buffers', 'hoistway'],
   carBufferHeight: ['buffers', 'hoistway'],
   carBufferStyle: ['buffers', 'hoistway'],
   cwtBufferComp: ['buffers', 'hoistway'],
   cwtBufferHeight: ['buffers', 'hoistway'],
   tripSpeed: ['buffers', 'hoistway'],
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
export const OverheadSteelLinks = new LinkTree('overheadSteel');
export const MachineLinks = new LinkTree('machine');
export const RailBracketLinks = new LinkTree('railBrackets');
export const SlingLinks = new LinkTree('sling');
