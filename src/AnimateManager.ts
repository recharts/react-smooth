import setRafTimeout from './setRafTimeout';

type ReactSmoothStyleType = string | string[] | Record<string, unknown> | (() => void);

type HandleChangeFn = (currentStyle?: ReactSmoothStyleType) => null | void;

export default function createAnimateManager() {
  let currStyle = {};
  let handleChange: (currentStyle?: ReactSmoothStyleType) => null | void = () => null;
  let shouldStop = false;

  const setStyle = (_style: ReactSmoothStyleType) => {
    if (shouldStop) {
      return;
    }

    if (Array.isArray(_style)) {
      if (!_style.length) {
        return;
      }

      const styles = _style;
      const [curr, ...restStyles] = styles;

      if (typeof curr === 'number') {
        setRafTimeout(setStyle.bind(null, restStyles), curr);

        return;
      }

      setStyle(curr);
      setRafTimeout(setStyle.bind(null, restStyles));
      return;
    }

    if (typeof _style === 'object') {
      currStyle = _style;
      handleChange(currStyle);
    }

    if (typeof _style === 'function') {
      _style();
    }
  };

  return {
    stop: () => {
      shouldStop = true;
    },
    start: (style: ReactSmoothStyleType) => {
      shouldStop = false;
      setStyle(style);
    },
    subscribe: (_handleChange: HandleChangeFn) => {
      handleChange = _handleChange;

      return () => {
        handleChange = () => null;
      };
    },
  };
}
