import { intersection } from 'lodash';

const PREFIX_LIST = ['Webkit', 'Moz', 'O', 'ms'];
const IN_COMPATIBLE_PROPERTY = ['transform', 'transformOrigin', 'transition'];

export const getIntersectionKeys = (preObj, nextObj) => {
  return intersection(Object.keys(preObj), Object.keys(nextObj));
};

/*
 * @description: convert camel case to dash case
 * string => string
 */
export const getDashCase = name => name.replace(/([A-Z])/g, v => '-' + v.toLowerCase());

/*
 * @description: add compatible style prefix
 * (string, string) => object
 */
export const generatePrefixStyle = (name, value) => {
  if (!name) { return null; }

  const camelName = name.replace(/(\w)/, v => v.toUpperCase());

  const result = PREFIX_LIST.reduce((res, entry) => {
    return {
      ...res,
      [entry + camelName]: value,
    };
  }, {});

  result[name] = value;

  return result;
};

export const log = console.log.bind(console);

/*
 * @description: log the value of a varible
 * string => any => any
 */
export const debug = name => item => {
  log(name, item);

  return item;
};

/*
 * @description: log name, args, return value of a function
 * function => function
 */
export const debugf = (tag, f) => (...args) => {
  const res = f(...args);
  const name = tag || f.name || 'anonymous function';
  const argNames = '(' + args.map(JSON.stringify).join(', ') + ')';

  log(name + ': ' + argNames + ' => ' + JSON.stringify(res));

  return res;
};

/*
 * @description: check if the received property need add compatible style prefix
 * string => boolean
 */
export const judgeNeedTranslated = property => IN_COMPATIBLE_PROPERTY.indexOf(property) !== -1;

/*
 * @description: map object on every element in this object.
 * (function, object) => object
 */
export const mapObject = (fn, obj) => {
  return Object.keys(obj).reduce((res, key) => {
    return {
      ...res,
      [key]: fn(key, obj[key]),
    };
  }, {});
};

/*
 * @description: add compatible prefix to style
 * object => object
 */
export const translateStyle = style => {
  return Object.keys(style).reduce((res, key) => {
    if (judgeNeedTranslated(key)) {
      return {
        ...res,
        ...generatePrefixStyle(key, res[key]),
      };
    }

    return res;
  }, style);
};
