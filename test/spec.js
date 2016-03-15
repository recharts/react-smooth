import Animate, { translateStyle } from '../src/';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import spies from 'chai-spies';
import chai from 'chai';

chai.use(spies);
const { expect } = chai;

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
    }, 700);
  });

  it('Should change style as steps', (done) => {
    let status = 'first';
    const handleAnimationEnd = chai.spy((s) => {
      status = s;
    });

    const instance = ReactTestUtils.renderIntoDocument(
      <Animate steps={[{
        duration: 0,
        style: { opacity: 0 },
      }, {
        duration: 500,
        style: { opacity: 1 },
        onAnimationEnd: handleAnimationEnd.bind(this, 'second'),
      }, {
        duration: 500,
        style: { opacity: 0.5 },
      }]}
        onAnimationEnd={handleAnimationEnd.bind(this, 'end')}
      >
        <div></div>
      </Animate>
    );

    expect(status).to.equal('first');
    setTimeout(() => {
      expect(handleAnimationEnd).to.have.been.called.with('second');
      expect(handleAnimationEnd).to.have.been.called.with('end');
      done();
    }, 1400);
  });
});

describe('translateStyle', () => {
  it('shoud get compatable style', () => {
    const style = {
      transform: 'translateY(20px)',
      transition: 'transform .4s ease',
    };

    const translatedStyle = translateStyle(style);

    expect(translatedStyle.WebkitTransform).to.equal('translateY(20px)');
    expect(translatedStyle.WebkitTransition).to.equal('-webkit-transform .4s ease');
  });
});
