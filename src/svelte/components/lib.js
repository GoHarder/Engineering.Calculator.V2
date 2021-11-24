/**
 * @module lib Library of functions to create components
 */

import { bubble, listen } from 'svelte/internal';

/**
 * Adds custom events to a component
 * @param {object} component The component object
 * @param {object} addedEvents Custom events to include
 */
export const forwardEvents = (component, addedEvents = []) => {
   const events = [
      'focus',
      'blur',
      'fullscreenchange',
      'fullscreenerror',
      'scroll',
      'cut',
      'copy',
      'paste',
      'keydown',
      'keypress',
      'keyup',
      'auxclick',
      'click',
      'contextmenu',
      'dblclick',
      'mousedown',
      'mouseenter',
      'mouseleave',
      'mousemove',
      'mouseover',
      'mouseout',
      'mouseup',
      'pointerlockchange',
      'pointerlockerror',
      'select',
      'wheel',
      'drag',
      'dragend',
      'dragenter',
      'dragstart',
      'dragleave',
      'dragover',
      'drop',
      'touchcancel',
      'touchend',
      'touchmove',
      'touchstart',
      'pointerover',
      'pointerenter',
      'pointerdown',
      'pointermove',
      'pointerup',
      'pointercancel',
      'pointerout',
      'pointerleave',
      'gotpointercapture',
      'lostpointercapture',
      ...addedEvents,
   ];

   const forward = (event) => bubble(component, event);

   return (node) => {
      const destructors = [];

      for (let i = 0; i < events.length; i++) {
         destructors.push(listen(node, events[i], forward));
      }

      return {
         destroy: () => {
            for (let i = 0; i < destructors.length; i++) {
               destructors[i]();
            }
         },
      };
   };
};

/**
 * Filters a components properties to pass down to other components
 * @param {object} props The components $$props object
 * @param {[string]} filter An array of properties to filter
 */
export const filterProps = (props, filter) => {
   return ['$$slots', '$$scope', ...filter].reduce(
      (obj, filterItem) => {
         delete obj[filterItem];
         return obj;
      },
      { ...props }
   );
};

/**
 * Creates a class string from an array
 * @param {[string]} classes An array of class string
 */
export const classList = (classes) => classes.join(' ').trim();

/** Creates a random id string  */
export const randomId = () => Math.random().toString(36).substr(2, 10);
