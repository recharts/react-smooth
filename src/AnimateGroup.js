import React, { Component, Children } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import PropTypes from 'prop-types';
import AnimateGroupChild from './AnimateGroupChild';

class AnimateGroup extends Component {
  static propTypes = {
    appear: PropTypes.object,
    enter: PropTypes.object,
    leave: PropTypes.object,

    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
    component: PropTypes.any,
  };

  static defaultProps = {
    component: 'span',
  };

  render() {
    const { component, children, appear, enter, leave } = this.props;

    return (
      <TransitionGroup component={component}>
        {
          Children.map(children, (child, index) => ((
            <AnimateGroupChild
              appearOptions={appear}
              enterOptions={enter}
              leaveOptions={leave}
              key={`child-${index}`}
            >
              {child}
            </AnimateGroupChild>
          )))
        }
      </TransitionGroup>
    );
  }
}

export default AnimateGroup;
