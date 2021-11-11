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
