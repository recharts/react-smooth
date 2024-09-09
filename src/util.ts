/* eslint no-console: 0 */

/**
 * Finds the intersection of keys between two objects
 * @param {object} preObj previous object
 * @param {object} nextObj next object
 * @returns an array of keys that exist in both objects
 */
export const getIntersectionKeys = (preObj: Record<string, unknown>, nextObj: Record<string, unknown>): string[] =>
  [Object.keys(preObj), Object.keys(nextObj)].reduce((a, b) => a.filter(c => b.includes(c)));

/**
 * converts a camel case string to dash case
 * @param {string} name string variable
 * @returns dash case string
 */
export const getDashCase = (name: string) => name.replace(/([A-Z])/g, v => `-${v.toLowerCase()}`);

/**
 * Maps an object to another object
 * @param {function} fn function to map
 * @param {object} obj object to map
 * @returns mapped object
 */
export const mapObject = (fn: (key: string, value: unknown) => void, obj: Record<string, unknown>) =>
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
 * @param {string | number} duration duration of transition
 * @param {string} easing easing of transition
 * @returns transition value
 */
export const getTransitionVal = (props: string[], duration: number | string, easing: string) =>
  props.map(prop => `${getDashCase(prop)} ${duration}ms ${easing}`).join(',');

const isDev = () => process.env.NODE_ENV !== 'production';

export const warn = (
  condition: boolean,
  format: string,
  a?: string,
  b?: string,
  c?: string,
  d?: string,
  e?: string,
  f?: string,
) => {
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
