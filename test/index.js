import React from 'react';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Animate, { translateStyle } from '../src';

Enzyme.configure({ adapter: new Adapter() });
chai.use(spies);

describe('Animate', () => {
  it('Should change the style of children', done => {
    const instance = mount(
      <Animate from="1" to="0" attributeName="opacity" duration={500}>
        <div className="test-wrapper" />
      </Animate>,
    );
    expect(instance.getDOMNode().style.opacity).to.equal('1');
    setTimeout(() => {
      expect(instance.getDOMNode().style.opacity).to.equal('0');
      done();
    }, 700);
  });

  it('Should called onAnimationEnd', done => {
    let num = 0;
    const handleAnimationEnd = () => {
      num += 1;
    };

    const instance = mount(
      <Animate
        from="1"
        to="0"
        attributeName="opacity"
        duration={500}
        onAnimationEnd={handleAnimationEnd}
      >
        <div />
      </Animate>,
    );

    expect(num).to.equal(0);
    setTimeout(() => {
      expect(num).to.equal(1);
      done();
    }, 700);
  });

  it('Should change style as steps', done => {
    let firstStatus = 'no';
    let secondStatus = 'no';

    const firstHandleAnimationEnd = () => {
      firstStatus = 'yes';
    };
    const secondHandleAnimationEnd = () => {
      secondStatus = 'yes';
    };

    const instance = mount(
      <Animate
        steps={[{
          duration: 0,
          style: { opacity: 0 },
        }, {
          duration: 500,
          style: { opacity: 1 },
          onAnimationEnd: firstHandleAnimationEnd,
        }, {
          duration: 500,
          style: { opacity: 0.5 },
        }]}
        onAnimationEnd={secondHandleAnimationEnd}
      >
        <div />
      </Animate>,
    );

    expect(firstStatus).to.equal('no');
    expect(secondStatus).to.equal('no');
    setTimeout(() => {
      expect(firstStatus).to.equal('yes');
      expect(secondStatus).to.equal('no');
    }, 700);

    setTimeout(() => {
      expect(firstStatus).to.equal('yes');
      expect(secondStatus).to.equal('yes');
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
