import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { AnimateGroup, configSpring } from 'react-smooth';

class GroupAnimation extends Component {
  state = {
    list: [{
      text: 'first...',
    }, {
      text: 'second...',
    }, {
      text: 'third...',
    }],
  };

  handleDel(index) {
    const { list } = this.state;

    this.setState({
      list: [...list.slice(0, index), ...list.slice(index + 1, list.length)],
    });
  }

  renderList() {
    const { list } = this.state;

    const items = list.map((item, index) => {
      const requestDel = this.handleDel.bind(this, index);

      return (
        <div className="item-wrapper"
          style={{
            width: 300,
            height: 50,
            backgroundColor: '#eee',
            boxShadow: '1px 1px 2px #bbb',
            marginBottom: 1,
            overflow: 'hidden',
          }}
          key={'item-' + item.text}
        >
          <div className="item"
            style={{
              width: 300,
              height: 50,
              padding: 14,
              marginLeft: 1,
              boxSizing: 'border-box',
            }}
          >
            {item.text}
            <a href="javascript:void(0);"
              className="btn del"
              style={{
                float: 'right',
                marginRight: 20,
              }}
              onClick={requestDel}
            >
              del
            </a>
          </div>
        </div>
      );
    });

    const leaveSteps = [{
      duration: 0,
      style: {
        transform: 'translateX(0)',
      },
    }, {
      duration: 1000,
      style: {
        transform: 'translateX(302px)',
        height: 50,
      },
    }, {
      duration: 1000,
      style: {
        height: 0,
      },
    }];

    return (
      <AnimateGroup leave={{ steps: leaveSteps }}>
        { items }
      </AnimateGroup>
    );
  }

  render() {
    return (
      <div className="group-animation"
        style={{
          overflow: 'hidden',
          width: 302,
        }}
      >
        {this.renderList()}
      </div>
    );
  }
}

ReactDom.render(<GroupAnimation />, document.getElementById('app'));
