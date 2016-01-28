const PREFIX_LIST = ['Webkit', 'Moz', 'O', 'ms'];
const IN_COMPATIBLE_PROPERTY = ['transform', 'transformOrigin', 'transition'];

export const __ = {
  '@@functional/placeholder': true,
};

const isPlaceHolder = val => val === __;

const _curry0 = (fn) => {
  return function _curried(...args) {
    if (args.length === 0 || args.length === 1 && isPlaceHolder(args[0])) {
      return _curried;
    }

    return fn(...args);
  };
};

const curryN = (n, fn) => {
  if (n === 1) {
    return fn;
  }

  return _curry0((...args) => {
    const argsLength = args.filter(arg => arg !== __).length;

    if (argsLength >= n) {
      return fn(...args);
    }

    return curryN(n - argsLength, _curry0((...restArgs) => {
      const newArgs = args.map(arg =>
        isPlaceHolder(arg) ? restArgs.shift() : arg
      );

      return fn(...newArgs, ...restArgs);
    }));
  });
};

export const curry = fn => {
  return curryN(fn.length, fn);
};

export const compose = (...args) => {
  if (!args.length) {
    return identity;
  }

  const fns = args.reverse();
  // first function can receive multiply arguments
  const firstFn = fns[0];
  const tailsFn = fns.slice(1);

  return (...composeArgs) =>
    tailsFn.reduce((res, fn) =>
      fn(res),
      firstFn(...composeArgs)
  );
};

const keys = obj => Object.keys(obj);
const intersection = (preArr, nextArr) => {
  let res = [];

  for (let i = 0, preLength = preArr.length; i < preLength; ++i) {
    for (let j = 0, nextLength = nextArr.length; j < nextLength; ++j) {
      if (preArr[i] === nextArr[j]) {
        res = [...res, preArr[i]];
        break;
      }
    }
  }

  return res;
};

export const getIntersectionKeys = (preObj, nextObj) => {
  return intersection(keys(preObj), keys(nextObj));
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
export const debugf = (f, tag) => (...args) => {
  const res = f(...args);
  const name = tag || f.name || 'anonymous function';
  const argNames = '(' + args.map(JSON.stringify).join(', ') + ')';

  log(name + ': ' + argNames + ' => ' + JSON.stringify(res));

  return res;
};

/*
 * @description: checks if the input style property need add compatible style prefix
 * string => boolean
 */
export const containsNeedTranslated = key => IN_COMPATIBLE_PROPERTY.indexOf(key) !== -1;

/*
 * @description: log name, args, return value of a function
 * (string, any) => object
 */
export const toObj = ([key, val]) => ({ [key]: val });

/*
 * @description: add compatible prefix to style
 * object => object
 */

const mapObj = curry((fn, obj) =>
  Object.keys(obj).map(key =>
    obj[key]
  ).map(fn)
);

export const translateStyle = style => {
  return Object.keys(style).reduce((res, key) => {
    if (containsNeedTranslated(key)) {
      return {
        ...res,
        ...generatePrefixStyle(key, res[key]),
      };
    }

    return res;
  }, style);
};
