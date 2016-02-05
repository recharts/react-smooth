import React, { Component, PropTypes, cloneElement, Children } from 'react';
import createAnimateManager from './AnimateManager';
import pureRender from 'pure-render-decorator';
import _ from 'lodash';
import { configEasing } from './easing';
import configUpdate from './configUpdate';
import { getDashCase, getIntersectionKeys } from './util';

const MIN_TIME = 50;

@pureRender
class Animate extends Component {
  static displayName = 'Animate';

  static propTypes = {
    from: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    attributeName: PropTypes.string,
    // animation duration
    duration: PropTypes.number,
    begin: PropTypes.number,
    easing: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    steps: PropTypes.arrayOf(PropTypes.shape({
      moment: PropTypes.number.isRequired,
      style: PropTypes.object.isRequired,
      easing: PropTypes.oneOfType([
        PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
        PropTypes.func,
      ]),
      // transition css properties(dash case), optional
      properties: PropTypes.arrayOf('string'),
      onAnimationEnd: PropTypes.func,
    })),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    isActive: PropTypes.bool,
    canBegin: PropTypes.bool,
    onAnimationEnd: PropTypes.func,
  };

  static defaultProps = {
    begin: 0,
    duration: 1000,
    from: '',
    to: '',
    attributeName: '',
    easing: 'ease',
    isActive: true,
    canBegin: true,
    steps: [],
    onAnimationEnd: () => {},
  };

  constructor(props, context) {
    super(props, context);

    const { isActive, attributeName, from, to, steps, children } = this.props;

    if (!isActive) {
      this.state = {};

      // if children is a function and animation is not active, set style to 'to'
      if (typeof children === 'function') {
        this.state = { style: to };
      }
      return;
    }

    if (steps && steps.length) {
      this.state = { style: steps[0].style };
    } else if (from) {
      if (typeof children === 'function') {
        this.state = {
          style: from,
        };

        return;
      }
      this.state = {
        style: attributeName ? { [attributeName]: from } : from,
      };
    } else {
      this.state = {};
    }
  }

  componentDidMount() {
    const { isActive, canBegin } = this.props;

    if (!isActive || !canBegin) {
      return;
    }

    this.runAnimation(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { isActive, canBegin } = nextProps;

    if (!isActive || !canBegin) {
      return;
    }

    const omitSpec = _.omit(this.props, ['children', 'onAnimationEnd']);
    const omitNextSpec = _.omit(nextProps, ['children', 'onAnimationEnd']);

    if (_.isEqual(omitSpec, omitNextSpec)) {
      return;
    }

    if (this.manager) {
      this.manager.stop();
    }

    if (this.stopJSAnimation) {
      this.stopJSAnimation();
    }

    this.runAnimation(nextProps);
  }

  componentWillUnmount() {
    if (this.manager) {
      this.manager.stop();
      this.manager = null;
    }

    if (this.stopJSAnimation) {
      this.stopJSAnimation();
    }
  }

  runJSAnimation(props) {
    const { from, to, duration, easing, begin, onAnimationEnd } = props;
    const render = style => this.setState({ style });
    const startAnimation = configUpdate(from, to, configEasing(easing), duration, render);

    const finalStartAnimation = () => {
      this.stopJSAnimation = startAnimation();
    };

    this.manager.start([
      from,
      begin,
      finalStartAnimation,
      duration,
      onAnimationEnd,
    ]);
  }

  runStepAnimation(props) {
    const { steps } = props;
    const { style: initialStyle, moment: initialTime } = steps[0];

    const addStyle = (sequence, nextItem, index) => {
      if (index === 0) {
        return sequence;
      }

      const {
        moment,
        easing = 'ease',
        style,
        properties: nextProperties,
        onAnimationEnd,
      } = nextItem;

      const preItem = index > 0 ? steps[index - 1] : nextItem;
      const properties = nextProperties ||
        getIntersectionKeys(preItem.style, style).map(getDashCase);
      const duration = moment - preItem.moment;

      if (typeof easing === 'function') {
        return [...sequence, this.runJSAnimation.bind(this, {
          from: preItem.style,
          to: style,
          duration,
          easing,
        }), duration];
      }

      const transition = properties.map(prop => {
        return `${prop} ${duration}ms ${easing}`;
      }).join(',');

      const newStyle = {
        ...preItem.style,
        ...style,
        transition,
      };

      const list = [...sequence, newStyle, duration];

      if (onAnimationEnd) {
        return [...list, onAnimationEnd];
      }

      return list;
    };

    return this.manager.start(
      [
        ...steps.reduce(addStyle, [initialStyle, Math.max(initialTime, MIN_TIME)]),
        props.onAnimationEnd,
      ]
    );
  }

  runAnimation(props) {
    if (!this.manager) {
      this.manager = createAnimateManager();
    }
    const {
      begin,
      duration,
      attributeName,
      from: propsFrom,
      to: propsTo,
      easing,
      onAnimationEnd,
      steps,
      children,
    } = props;

    const manager = this.manager;
    manager.subscribe(::this.handleStyleChange);

    if (typeof easing === 'function' || typeof children === 'function' || easing === 'spring') {
      this.runJSAnimation(props);
      return;
    }

    const from = attributeName ? { [attributeName]: propsFrom } : propsFrom;
    const to = attributeName ? { [attributeName]: propsTo } : propsTo;

    if (steps.length > 1) {
      this.runStepAnimation(props);
      return;
    }

    const transition = getIntersectionKeys(from, to).map(key => {
      return `${getDashCase(key)} ${duration}ms ${easing}`;
    }).join(',');

    manager.start([from, Math.max(begin, MIN_TIME), { ...to, transition }, duration, onAnimationEnd]);
  }

  handleStyleChange() {
    const style = this.manager.getStyle();
    this.setState({ style });
  }

  render() {
    const {
      children,
      begin,
      duration,
      attributeName,
      easing,
      isActive,
      steps,
      from,
      to,
      ...others,
    } = this.props;
    const count = Children.count(children);

    if (typeof children === 'function') {
      return children(this.state.style);
    }

    if (!isActive || count === 0) {
      return children;
    }

    const cloneContainer = container => {
      const { style = {}, className } = container.props;

      const res = cloneElement(container, {
        ...others,
        style: {
          ...style,
          ...this.state.style,
        },
        className,
      });
      return res;
    };

    if (count === 1) {
      const onlyChild = Children.only(children);

      return cloneContainer(Children.only(children));
    }

    return <div>{Children.map(children, child => cloneContainer(child))}</div>;
  }
}

export default Animate;
