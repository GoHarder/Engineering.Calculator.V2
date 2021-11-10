/**
 * @module terminal Library for terminal strings
 */

/** An object of all the terminal colors */
const colors = {
   default: { text: 39, background: 49 },
   black: { text: 30, background: 40 },
   blue: { text: 34, background: 44 },
   cyan: { text: 36, background: 46 },
   green: { text: 32, background: 42 },
   magenta: { text: 35, background: 45 },
   red: { text: 31, background: 41 },
   white: { text: 97, background: 107 },
   yellow: { text: 33, background: 43 },
   'dark gray': { text: 90, background: 100 },
   'light gray': { text: 37, background: 47 },
   'light blue': { text: 94, background: 104 },
   'light cyan': { text: 96, background: 106 },
   'light green': { text: 92, background: 102 },
   'light magenta': { text: 95, background: 105 },
   'light red': { text: 91, background: 101 },
   'light yellow': { text: 93, background: 103 },
};

/**
 * Creates a horizontal line in the terminal
 * @param width number
 */
export const hr = (width = 0) => {
   // Get the available space
   if (!width) width = process.stdout.columns - 1;
   let line = '';
   for (let i = 0; i < width; i++) line += '─';
   return line;
};

/**
 * Styles a log string
 * @param {string} str The string to style
 * @param {object} options The style options
 * @param {boolean} options.bold Makes the string bold
 * @param {boolean} options.dim Makes the string dim
 * @param {boolean} options.underline Underlines the string
 * @param {boolean} options.invert Inverts the background and text
 * @param {boolean} options.hidden Hides the string
 * @param {string} options.color The text color
 * @param {string} options.background The background color
 */
export const style = (str, options) => {
   const { bold, dim, underline, invert, hidden, color, background } = options;

   // Build format string
   let formatCode = [bold ? '1;' : '', dim ? '2;' : '', underline ? '4;' : '', invert ? '7;' : '', hidden ? '8;' : ''].join('');

   if (color && colors[color]) formatCode += `${colors[color].text};`;

   if (background && colors[background]) formatCode += `${colors[background].background};`;

   formatCode = formatCode.replace(/;$/, '');

   return `\x1b[${formatCode}m${str}\x1b[0m`;
};
