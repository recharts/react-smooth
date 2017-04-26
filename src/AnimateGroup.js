import React, { Component, Children } from 'react';
import { TransitionGroup as ReactTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import AnimateGroupChild from './AnimateGroupChild';

class AnimateGroup extends Component {
  static propTypes = {
    appear: PropTypes.object,
    leave: PropTypes.object,
    enter: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
    component: PropTypes.any,
  };

  static defaultProps = {
    component: 'span',
  };

  wrapChild(child) {
    const { appear, leave, enter } = this.props;

    return (
      <AnimateGroupChild
        appear={appear}
        leave={leave}
        enter={enter}
      >
        {child}
      </AnimateGroupChild>
    );
  }

  render() {
    const { component, children } = this.props;

    return (
      <ReactTransitionGroup
        component={component}
        childFactory={::this.wrapChild}
      >
        {children}
      </ReactTransitionGroup>
    );
  }
}

export default AnimateGroup;
