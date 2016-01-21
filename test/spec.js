import Animate from '../src/';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

describe('Animate', () => {

  it('Should change the style of children', (done) => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Animate from="1" to="0" attributeName="opacity" duration={500}>
        <div></div>
      </Animate>
    );

    expect(ReactDOM.findDOMNode(instance).style.opacity).to.equal('1');
    setTimeout(() => {
      expect(ReactDOM.findDOMNode(instance).style.opacity).to.equal('0');
      done();
    }, 600);
  });

  it('Should called onAnimationEnd', (done) => {
    let num = 0;
    const handleAnimationEnd = () => {
      num = num + 1;
    };

    const instance = ReactTestUtils.renderIntoDocument(
      <Animate from="1" to="0"
        attributeName="opacity"
        duration={500}
        onAnimationEnd={handleAnimationEnd}
      >
        <div></div>
      </Animate>
    );

    expect(num).to.equal(0);
    setTimeout(() => {
      expect(num).to.equal(1);
      done();
    }, 600);
  });

  it('Should change style as steps', (done) => {
    let status = 'first';
    const handleAnimationEnd = (s) => {
      status = s;
    };

    const instance = ReactTestUtils.renderIntoDocument(
      <Animate steps={[{
        moment: 0,
        style: { opacity: 0 },
      }, {
        moment: 500,
        style: { opacity: 1 },
        onAnimationEnd: handleAnimationEnd.bind(this, 'second'),
      }, {
        moment: 1000,
        style: { opacity: 0.5 },
      }]}
        onAnimationEnd={handleAnimationEnd.bind(this, 'end')}
      >
        <div></div>
      </Animate>
    );

    expect(status).to.equal('first');
    expect(ReactDOM.findDOMNode(instance).style.opacity).to.equal('0');
    setTimeout(() => {
      expect(ReactDOM.findDOMNode(instance).style.opacity).to.equal('1');
    });
    setTimeout(() => {
      expect(status).to.equal('second');
      expect(ReactDOM.findDOMNode(instance).style.opacity).to.equal('0.5');
      done();
    }, 600);
    setTimeout(() => {
      expect(status).to.equal('end');
      done();
    }, 1100);
  });
});
