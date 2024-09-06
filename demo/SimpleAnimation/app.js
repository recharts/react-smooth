import Animate from 'react-smooth';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

class Simple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to: 100,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    const { to } = this.state;
    this.setState({
      to: to + 100,
    });
  };

  render() {
    const { to } = this.state;
    return (
      <div className="simple">
        <button type="button" onClick={this.handleClick}>
          click me!
        </button>
        <Animate easing="spring" from={{ y: 0 }} to={{ y: to }}>
          {({ y }) => (
            <div
              style={{
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
