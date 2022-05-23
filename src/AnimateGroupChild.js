/* eslint-disable react/jsx-props-no-spreading */
import React, { Component, Children } from 'react';
import { Transition } from 'react-transition-group';
import PropTypes from 'prop-types';
import Animate from './Animate';

if (Number.isFinite === undefined) {
  Number.isFinite = function isFinite(value) {
    return typeof value === 'number' && isFinite(value);
  };
}

const parseDurationOfSingleTransition = (options = {}) => {
  const { steps, duration } = options;

  if (steps && steps.length) {
    return steps.reduce(
      (result, entry) =>
        result +
        (Number.isFinite(entry.duration) && entry.duration > 0
          ? entry.duration
          : 0),
      0,
    );
  }

  if (Number.isFinite(duration)) {
    return duration;
  }

  return 0;
};

class AnimateGroupChild extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    appearOptions: PropTypes.object,
    enterOptions: PropTypes.object,
    leaveOptions: PropTypes.object,
    children: PropTypes.element,
  };

  // eslint-disable-next-line react/state-in-constructor
  state = {
    isActive: false,
  };

  handleStyleActive(style) {
    if (style) {
      const onAnimationEnd = style.onAnimationEnd
        ? () => {
            style.onAnimationEnd();
          }
        : null;

      this.setState({
        ...style,
        onAnimationEnd,
        isActive: true,
      });
    }
  }

  handleEnter = (node, isAppearing) => {
    const { appearOptions, enterOptions } = this.props;

    this.handleStyleActive(isAppearing ? appearOptions : enterOptions);
  };

  handleExit = () => {
    // eslint-disable-next-line react/destructuring-assignment
    this.handleStyleActive(this.props.leaveOptions);
  };

  parseTimeout() {
    const { appearOptions, enterOptions, leaveOptions } = this.props;

    return (
      parseDurationOfSingleTransition(appearOptions) +
      parseDurationOfSingleTransition(enterOptions) +
      parseDurationOfSingleTransition(leaveOptions)
    );
  }

  render() {
    const { children, appearOptions, enterOptions, leaveOptions, ...props } =
      this.props;

    return (
      <Transition
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        timeout={this.parseTimeout()}
      >
        {() => <Animate {...this.state}>{Children.only(children)}</Animate>}
      </Transition>
    );
  }
}

export default AnimateGroupChild;
