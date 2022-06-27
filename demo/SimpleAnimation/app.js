import Animate from 'react-smooth';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

class Simple extends Component {
  state = {
    to: 100,
  };

  handleClick = () => {
    this.setState({
      to: this.state.to + 100,
    });
  }

  render() {
    return (
      <div className="simple">
        <button onClick={this.handleClick}>click me!
        </button>
        <Animate easing="spring" from={{ y: 0 }} to={{ y: this.state.to }}>
          {({ y }) => (
            <div style={{
              width: 100,
              height: 100,
              backgroundColor: 'red',
              transform: `translate(0, ${y}px)`,
            }}
            />
          )}
        </Animate>
        <div className="graph" />
      </div>
    );
  }
}

ReactDom.render(<Simple />, document.getElementById('app'));
