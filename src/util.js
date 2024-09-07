/* eslint no-console: 0 */

/**
 * Finds the intersection of keys between two objects
 * @param {object} preObj previous object
 * @param {object} nextObj next object
 * @returns an array of keys that exist in both objects
 */
export const getIntersectionKeys = (preObj, nextObj) =>
  [Object.keys(preObj), Object.keys(nextObj)].reduce((a, b) => a.filter(c => b.includes(c)));

/**
 * converts a camel case string to dash case
 * @param {string} name string variable
 * @returns dash case string
 */
export const getDashCase = name => name.replace(/([A-Z])/g, v => `-${v.toLowerCase()}`);

/**
 * Maps an object to another object
 * @param {function} fn function to map
 * @param {object} obj object to map
 * @returns mapped object
 */
export const mapObject = (fn, obj) =>
  Object.keys(obj).reduce(
    (res, key) => ({
      ...res,
      [key]: fn(key, obj[key]),
    }),
    {},
  );

/**
 * Gets the transition value for a set of properties
 * @param {array} props array of properties
 * @param {string} duration duration of transition
 * @param {string} easing easing of transition
 * @returns transition value
 */
export const getTransitionVal = (props, duration, easing) =>
  props.map(prop => `${getDashCase(prop)} ${duration}ms ${easing}`).join(',');

const isDev = () => process.env.NODE_ENV !== 'production';

export const warn = (condition, format, a, b, c, d, e, f) => {
  if (isDev() && typeof console !== 'undefined' && console.warn) {
    if (format === undefined) {
      console.warn('LogUtils requires an error message argument');
    }

    if (!condition) {
      if (format === undefined) {
        console.warn(
          'Minified exception occurred; use the non-minified dev environment ' +
            'for the full error message and additional helpful warnings.',
        );
      } else {
        const args = [a, b, c, d, e, f];
        let argIndex = 0;

        console.warn(format.replace(/%s/g, () => args[argIndex++]));
      }
    }
  }
};
