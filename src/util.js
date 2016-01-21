import R from 'ramda';

const PREFIX_LIST = ['Webkit', 'Moz', 'O', 'ms'];
const IN_COMPATIBLE_PROPERTY = ['transform', 'transformOrigin', 'transition'];

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
export const containsNeedTranslated = R.contains(R.__, IN_COMPATIBLE_PROPERTY);

/*
 * @description: log name, args, return value of a function
 * (string, any) => object
 */
export const toObj = ([key, val]) => ({ [key]: val });

/*
 * @description: add compatible prefix to style
 * object => object
 */
export const translateStyle = R.pipe(
  R.converge(R.zip, [R.keys, R.values]),
  R.map(
    R.ifElse(
      R.pipe(
        R.head,
        containsNeedTranslated
      ),
      R.apply(generatePrefixStyle),
      toObj,
    )
  ),
  R.mergeAll,
);
