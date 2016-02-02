import React, { Component, PropTypes, createElement, Children } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';

import AnimateGroupChild from './AnimateGroupChild';

class AnimateGroup extends Component {
  static propTypes = {
    appear: PropTypes.object,
    leave: PropTypes.object,
    enter: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  };

  _wrapChild(child) {
    const { appear, leave, enter } = this.props;

    return createElement(
      AnimateGroupChild,
      {
        appear,
        leave,
        enter,
      },
      child
    );
  }

  render() {
    return createElement(ReactTransitionGroup, {
      childFactory: ::this._wrapChild,
    }, this.props.children);
  }
}

export default AnimateGroup;
