import React, { Component, PropTypes, cloneElement, Children } from 'react';
import createAnimateManager from './AnimateManager';
import pureRender from 'pure-render-decorator';
import R from 'ramda';
import { getDashCase, debug } from './util';

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
      const preItem = R.ifElse(R.lte(0), R.nth(R.__, steps), R.always(nextItem))(index - 1);
      const properties = nextProperties ||
        R.map(
          getDashCase,
          R.intersection(R.keys(preItem.style), R.keys(style))
      );
      const duration = moment - preItem.moment;
      const transition = R.map(R.add(R.__, ' ' + duration + 'ms ' + easing), properties).join(',');
      const newStyle = {
        ...nextItem.style,
        transition,
      };
      const appendSequence = R.append(R.__, sequence);

      return R.ifElse(
        R.isNil,
        R.always([...sequence, newStyle, duration]),
        R.always([...sequence, newStyle, duration, onAnimationEnd])
      )(onAnimationEnd);
    };

    return this.manager.setStyle(
      R.append(
        this.props.onAnimationEnd,
        R.addIndex(R.reduce)(addStyle, [initialStyle, initialTime], steps)
      )
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

    const getTransitionValue = (d, e) => key => `${getDashCase(key)} ${d}ms ${e}`;
    const getTransitionValues = (pre, next, getTransitionVal) =>
      R.map(getTransitionVal, R.intersection(R.keys(pre), R.keys(next))).join(',');

    if (steps.length > 1) {
      this.runStepAnimation(steps);
      return;
    }

    const transition = getTransitionValues(from, to, getTransitionValue(duration, easing));

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
