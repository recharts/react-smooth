import Animate from 'react-css-animation';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

const point = (x, y) => {
  const currX = x;
  const currY = y;

  return {
    getPath: cmd => [cmd, currX, currY].join(' '),
    getCircle: (props) => <circle cx={currX} cy={currY} { ...props } />,
    x: currX,
    y: currY,
  };
};

const getArcPath = (radius, rotation, isLarge, isSweep, dx, dy) => {
  return ['A', radius, radius, rotation, isLarge, isSweep, dx, dy].join(' ');
};

class Gossip extends Component {
  static displayName = 'Gossip';

  state = { canBegin: false };

  componentDidMount() {
    this.setState({ canBegin: true });
  }

  renderSmallCircles() {
    const cx = 110;
    const cy = 110;
    const r = 100;
    const sr = r / 2;
    const tr = 5;

    const centers = [point(cx, cy - sr), point(cx, cy + sr)];
    const circles = centers.map((p, i) =>
      p.getCircle({
        r: tr,
        fill: i ? 'white' : 'black',
        key: i,
      })
    );

    return <g className="small-circles">{circles}</g>;
  }

  renderPath() {
    const cx = 110;
    const cy = 110;
    const r = 100;
    const sr = r / 2;

    const beginPoint = point(cx, cy - r);
    const endPoint = point(cx, cy + r);
    const move = beginPoint.getPath('M');
    const A = getArcPath(sr, 0, 0, 0, cx, cy);
    const A2 = getArcPath(sr, 0, 0, 1, endPoint.x, endPoint.y);
    const A3 = getArcPath(r, 0, 0, 1, beginPoint.x, beginPoint.y);

    return <path d={[move, A, A2, A3].join('\n')} />;
  }

  renderText() {
    return (
      <Animate begin={5000}
        from={{ opacity: 0, transform: 'scale(1)' }}
        to={{ opacity: 1, transform: 'scale(1.5)' }}
      >
        <g style={{ transformOrigin: 'center center' }}>
        <text x="500" y="300">May you no bug this year</text>
        </g>
      </Animate>
    );
  }

  render() {
    const steps = [{
      moment: 1000,
      style: {
        opacity: 0,
      },
    }, {
      moment: 2000,
      style: {
        opacity: 1,
        transform: 'rotate(0deg) translate(0px, 0px)',
        easing: 'ease-in',
      },
    }, {
      moment: 3000,
      style: {
        transformOrigin: '110px 110px',
        transform: 'rotate(500deg) translate(0px, 0px)',
        easing: 'ease-in-out',
      },
    }, {
      moment: 5000,
      style: {
        transformOrigin: '610px 610px',
        transform: 'rotate(1440deg) translate(500px, 500px)',
      },
    }, {
      moment: 5050,
      style: {
        transformOrigin: 'center center',
        transform: 'translate(500px, 500px) scale(1)',
      },
    }, {
      moment: 5500,
      style: {
        transformOrigin: 'center center',
        transform: 'translate(500px, 500px) scale(1.6)',
      },
    }];

    return (
      <svg width="1000" height="1000">
        <Animate steps={steps} >
          <g className="gossip">
            <circle cx="110" cy="110" r="100" style={{ stroke: 'black', fill: 'white' }} />
            {this.renderPath()}
            {this.renderSmallCircles()}
          </g>
        </Animate>
        {this.renderText()}
      </svg>
    );
  }
}

ReactDom.render(<Gossip />, document.getElementById('app'));
