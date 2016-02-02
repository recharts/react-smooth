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
      shouldStop = false;
      currStyle = translateStyle(style);
      handleChange();
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
      setStyle: (action) => setStyle(action),
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    setStyle = compose(...chain)(manager.setStyle);

    return {
      ...manager,
      setStyle,
    };
  };
};

const setStyleAsync = ({ setStyle, getShouldStop }) => next => {
  let timeout = null;

  return style => {
    if (getShouldStop()) {
      clearTimeout(timeout);

      return new Promise((resolve, reject) => reject());
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

const finalCreateAniamteManager = compose(
  applyMiddleware(setStyleAsync, sequenceMiddleware, thunkMiddeware)
)(createAnimateManager);

export default finalCreateAniamteManager;
