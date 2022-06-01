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
export const classList = (classes) => classes.join(' ').replace(/\s{2,}/g, ' ');

/** Creates a random id string  */
export const randomId = () => Math.random().toString(36).slice(2);

/**
 * This is a polyfill for css container queries
 * @param {HTMLElement} element The element to apply the query to
 * @param {object} breakpoints The breakpoints and classes to apply
 */
export const containerQuery = (element, breakpoints) => {
   let debug = false;

   if ('debug' in breakpoints) {
      debug = true;
      delete breakpoints.debug;
   }

   const onResize = () => {
      const width = element.clientWidth;

      if (debug) console.log(width);

      const points = Object.entries(breakpoints);
      const classes = points.reduce((output, [point, classes], i) => {
         element.classList.remove(...classes);
         const prevPoint = parseFloat(points?.[i - 1]?.[0] ?? 0);
         point = parseFloat(point);

         if (point >= width && width >= prevPoint) return classes;
         return output;
      }, []);

      element.classList.add(...classes);
   };

   const observer = new ResizeObserver(onResize);

   observer.observe(element);

   return {
      destroy() {
         observer.disconnect();
      },
   };
};
