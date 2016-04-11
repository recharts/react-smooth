import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import raf, { caf } from 'raf';
import _ from 'lodash';
import { translateStyle } from 'react-smooth';

const g = 0.2;
// string
const k = 0.005;
const SEGMENT_DISTANCE = 0.5;
const WIND_STRENGTH = 0.1;
const FORCE_STRENGTH = 0.0001;
const damping = -0.5;

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static magnitude = vector => Math.sqrt(Vector2.sqrMagnitude(vector));

  static sqrMagnitude = vector => Math.pow(vector.x, 2) + Math.pow(vector.y, 2);

  static distance = (vector1, vector2) =>
    Vector2.magnitude(Vector2.subtraction(vector2, vector1));

  static add = (...vectors) =>
    vectors.reduce((result, vector) =>
      new Vector2(result.x + vector.x, result.y + vector.y), new Vector2(0, 0));

  static randomNormal = () => {
    const theta = Math.random() * Math.PI * 2;

    return new Vector2(Math.cos(theta), Math.sin(theta));
  };

  static subtraction = (to, from) => {
    return new Vector2(to.x - from.x, to.y - from.y);
  };

  static mul = (v1, v2) => {
    return new Vector2(v1.x * v2.x, v1.y * v2.y);
  };

  normal() {
    return Vector2.normal(this);
  }

  scale(k) {
    return new Vector2(this.x * k, this.y * k);
  }

  move(...vectors) {
    const result = Vector2.add(this, ...vectors);

    this.x = result.x;
    this.y = result.y;
  }

  getAngle() {
    const normal = this.normal();
    let angle = Math.acos(normal.x);

    if (normal.y < 0 || normal.y === 0 && normal.x < 0) {
      angle = Math.PI * 2 - angle;
    }

    return angle;
  }

  selfScale(k) {
    const result = this.scale(k);

    this.x = result.x;
    this.y = result.y;
  }

  normal() {
    const magnitude = Vector2.magnitude(this);
    return this.scale(1 / magnitude);
  }

  getTransform(point) {
    const magnitude = Vector2.magnitude(this);
    const angle = -this.getAngle();
    const matrix = [
      Math.cos(angle) * magnitude,
      -Math.sin(angle) * magnitude,
      Math.sin(angle),
      Math.cos(angle),
    ].join(', ');

    return `matrix(${matrix}, ${point.x + 100}, ${point.y + 100})`;
  }
}

const GRAVITY = new Vector2(0, g);

class RopeSegment {
  constructor(point, npoint) {
    this.point = point;
    this.npoint = npoint;
  }

  getStringStrength(k) {
    const distance = Vector2.distance(this.point, this.npoint);
    const deltaX = distance - SEGMENT_DISTANCE;

    if (deltaX <= 0) {
      return new Vector2(0, 0);
    }

    return Vector2.subtraction(this.npoint, this.point)
      .normal()
      .scale(deltaX * deltaX * deltaX * deltaX * k);
  }
}


class Rope extends Component {
  static propTypes = {
    ropeLength: PropTypes.number,
    k: PropTypes.number,
    wind: PropTypes.number,
    forceK: PropTypes.number,
    g: PropTypes.number,
  };

  state = { points: [], k };

  componentDidMount() {
    const { ropeLength } = this.props;
    const points = [];

    for (let i = 0; i < ropeLength; i += SEGMENT_DISTANCE) {
      const point = new Vector2(0, i);

      point.velocity = new Vector2(0, 0);
      points.push(point);
    }

    this.setState({ points });
    this.cafId = raf(this.update.bind(this));
  }

  componentWillUnmount() {
    if (this.cafId) {
      caf(this.cafId);
    }
  }

  update(now) {
    if (!this.preTime) {
      this.preTime = now;
      this.cafId = raf(this.update.bind(this));
      return;
    }

    const deltaTime = (now - this.preTime) / 1000;
    const points = _.cloneDeep(this.state.points);
    const wind = new Vector2(WIND_STRENGTH * Math.random(), 0);

    for (let i = 1; i < points.length; ++i) {
      const point = points[i];

      const neiborPoint = points[i - 1];
      const segment = new RopeSegment(point, neiborPoint);
      const totalStringStrength = segment.getStringStrength(this.state.k);

      // const totalStringStrength = neiborPoints.reduce((string, npoint) => {
      //   const segment = new RopeSegment(point, npoint);

      //   return Vector2.add(string, segment.getStringStrength());
      // }, new Vector2(0, 0));

      const force = Vector2.add(GRAVITY, wind, totalStringStrength, point.velocity.scale(damping))
        .scale(FORCE_STRENGTH);

      console.log(force, totalStringStrength);
      point.velocity = Vector2.add(point.velocity, force);
      points[i].move(point.velocity);
    }
    console.log(points);
    this.setState({ points });
    this.preTime = now;
    this.cafId = raf(this.update.bind(this));
  }

  render() {
    const { points } = this.state;
    const pointStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: 'left top',
      stroke: 'black',
    };

    const transforms = _.range(0, Math.max(0, points.length - 1))
      .map(index => {
        const from = points[index];
        const to = points[index + 1];

        return Vector2.subtraction(to, from).getTransform(from);
      });

    const valueLink = {
      value: this.state.k,
      requestChange: k => this.setState({ k }),
    };

    return (
      <div>
        <div>k: <input type="number" valueLink={valueLink} /></div>
        <br />
        <svg
          width={1200}
          height={1200}
          viewPort={`0 0 ${1200} ${1200}`}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className="rope"
          style={{ position: 'relative' }}
        >
          {
            transforms.map((transform, i) => {
              return (
                <line
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                  className="segment"
                  key={'segment-' + i}
                  style={{
                    ...pointStyle,
                    transform,
                  }}
                />
              );
            })
          }
        </svg>
      </div>
    );
  }
}

// class App extends Component {

//   render() {
//     const k 
    
//     return (
//       <div className="app">
//         k: <input type="number" valueLink={thetaValueLink} placeholder="0 ~ 90" />
//         <br />
//         rope length: <input type="number" valueLink={ropeValueLink} placeholder="rope length" />
//         <Pendulum
//           theta={ theta && (parseInt(theta, 10) / 180 * Math.PI) || 0.3 }
//           ropeLength={ ropeLength && parseInt(ropeLength, 10) || 300 }
//           radius={30}
//         />
//       </div>
//     );
//   }
// }

ReactDom.render(<Rope ropeLength={71} />, document.getElementById('app'));
