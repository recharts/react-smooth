import React, { Component, PropTypes, cloneElement, Children } from 'react';
import createAnimateManager from './AnimateManager';
import pureRender from 'pure-render-decorator';
import { getDashCase, debug, getIntersectionKeys } from './util';

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
    easing: PropTypes.string,
    steps: PropTypes.arrayOf(PropTypes.shape({
      moment: PropTypes.number.isRequired,
      style: PropTypes.object.isRequired,
      easing: PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
      // dash case type animation css properties
      properties: PropTypes.arrayOf('string'),
      onAnimationEnd: PropTypes.func,
    })),
    children: PropTypes.node,
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

    const { isActive, attributeName, from, to, steps } = this.props;

    if (!isActive) {
      this.state = {};
      return;
    }

    if (steps && steps.length) {
      this.state = { style: steps[0].style };
    } else if (from) {
      this.state = {
        style: attributeName ? { [attributeName]: from } : from,
      };
    } else {
      this.state = {};
    }
  }

  componentDidMount() {
    this.runAnimation(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.canBegin && nextProps.canBegin) {
      this.runAnimation(nextProps);
    }
  }

  runStepAnimation() {
    const { steps } = this.props;
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
      const transition = properties.map(prop => {
        return `${prop} ${duration}ms easing`;
      }).join(',');

      const newStyle = {
        ...nextItem.style,
        transition,
      };

      const list = [...sequence, newStyle, duration];

      if (onAnimationEnd) {
        return [...list, onAnimationEnd];
      }

      return list;
    };

    return this.manager.setStyle(
      [
        ...steps.reduce(addStyle, [initialStyle, initialTime]),
        this.props.onAnimationEnd,
      ]
    );
  }

  runAnimation(props) {
    if (!this.manager) {
      this.manager = createAnimateManager();
    }

    const {
      canBegin,
      begin,
      duration,
      attributeName,
      from: propsFrom,
      to: propsTo,
      easing,
      isActive,
      onAnimationEnd,
      steps,
    } = props;

    if (!isActive || !canBegin) {
      return;
    }

    const manager = this.manager;
    manager.subscribe(::this.handleStyleChange);

    const from = attributeName ? { [attributeName]: propsFrom } : propsFrom;
    const to = attributeName ? { [attributeName]: propsTo } : propsTo;

    if (steps.length > 1) {
      this.runStepAnimation(steps);
      return;
    }

    const transition = getIntersectionKeys(from, to).map(key => {
      return `${getDashCase(key)} ${duration}ms ${easing}`;
    }).join(',');

    manager.setStyle([from, begin, { ...to, transition }, duration, onAnimationEnd]);
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
    const container = Children.only(children);
    // todo: set animation to all children
    const { style = {}, className } = container.props;

    if (!isActive) {
      return children;
    }

    return cloneElement(container, {
      ...others,
      style: {
        ...this.state.style,
        ...style,
      },
      className,
    });
  }
}

export default Animate;
