import { translateStyle, debugf } from './util';
import R from 'ramda';

const createAnimateManager = initialStyle => {
  let currStyle = initialStyle;
  let handleChange = () => {};

  return {
    subscribe: listener => {
      handleChange = listener;
    },
    setStyle: (style) => {
      currStyle = translateStyle(style);
      handleChange();
    },
    getStyle: () => currStyle,
  };
};

const applyMiddleware = (...middlewares) => {
  return (next) => style => {
    var manager = next(style);
    var setStyle = manager.setStyle;
    var chain = [];

    var middlewareAPI = {
      getStyle: manager.getStyle,
      setStyle: (action) => setStyle(action),
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    setStyle = R.compose(...chain)(manager.setStyle);

    return {
      ...manager,
      setStyle,
    };
  };
};

const setStyleAsync = ({ setStyle }) => next => style => {
  if (typeof style === 'function' || Array.isArray(style)) {
    return next(style);
  }

  return new Promise((resolve, reject) => {
    let timeout = 0;
    let callback = next;

    if (typeof style === 'number') {
      timeout = style;
      callback = () => {};
    }

    setTimeout(() => {
      const res = callback(style);
      resolve();

      return res;
    }, timeout);
  });
};

const sequenceMiddleware = ({ setStyle }) => next => style => {
  if (Array.isArray(style)) {
    const styles = style;

    return styles.reduce(
      (result, currStyle) => result.then(() => {
        return setStyle(currStyle);
      }),
      Promise.resolve()
    );
  }

  return next(style);
};

const thunkMiddeware = ({ setStyle, getStyle }) => next => style => {
  if (typeof style === 'function') {
    return style(setStyle, getStyle);
  }

  return next(style);
};

const finalCreateAniamteManager = R.compose(
  applyMiddleware(setStyleAsync, sequenceMiddleware, thunkMiddeware)
)(createAnimateManager);

export default finalCreateAniamteManager;
