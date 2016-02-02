import { translateStyle } from './util';
import compose from 'lodash/fp/compose';

const createAnimateManager = initialStyle => {
  let currStyle = initialStyle;
  let handleChange = () => {};
  let shouldStop = false;

  return {
    subscribe: listener => {
      handleChange = listener;
    },
    setStyle: (style) => {
      currStyle = translateStyle(style);
      handleChange();
    },
    start: () => {
      shouldStop = false;
    },
    getShouldStop: () => shouldStop,
    getStyle: () => currStyle,
    stop: () => {
      shouldStop = true;
    },
  };
};

const applyMiddleware = (...middlewares) => {
  return (next) => style => {
    var manager = next(style);
    var setStyle = manager.setStyle;
    var chain = [];

    var middlewareAPI = {
      ...manager,
      setStyle: (_style) => setStyle(_style),
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    setStyle = compose(...chain)(manager.setStyle);

    return {
      ...manager,
      setStyle,
      start: (_style) => {
        manager.start();
        return setStyle(_style);
      },
    };
  };
};

const setStyleAsync = ({ setStyle, getShouldStop }) => next => {
  let timeout = null;

  return style => {
    if (getShouldStop()) {
      clearTimeout(timeout);

      return new Promise((resolve, reject) => {
        reject();
      });
    }

    if ((typeof style === 'function' || Array.isArray(style))) {
      return next(style);
    }

    return new Promise((resolve, reject) => {
      let delay = 0;
      let callback = next;

      if (typeof style === 'number') {
        delay = style;
        callback = () => {};
      }

      timeout = setTimeout(() => {
        const res = callback(style);
        resolve();

        return res;
      }, delay);
    });
  };
};

const sequenceMiddleware = ({ setStyle }) => next => style => {
  if (Array.isArray(style)) {
    const styles = style;

    return styles.reduce(
      (result, currStyle) => result.then(() => {
        return setStyle(currStyle);
      }).catch(() => {}),
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


/*
 * manager.setStyle:
 * if style is an object, manager will set a new style.
 * if style is a number, manager will wait time of style microsecond.
 * if style is a function, manager will run this function bind arguments of
 *  getStyle and setStyle.
 * if style is an array, manager will run setStyle of every element in order.
 */
const finalCreateAniamteManager = compose(
  applyMiddleware(setStyleAsync, sequenceMiddleware, thunkMiddeware)
)(createAnimateManager);

export default finalCreateAniamteManager;
