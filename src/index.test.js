import React from 'react';
import { mount } from 'enzyme';
import Animate, { translateStyle } from './index';


describe('Animate', () => {
  it('Should change the style of children', (done) => {
    const demo = (
      <Animate from="1" to="0" attributeName="opacity" duration={500}>
        <div className="test-wrapper" />
      </Animate>
    );
    const instance = mount(demo);
    expect(instance.getDOMNode().style.opacity).toEqual('1');
    setTimeout(() => {
      expect(instance.getDOMNode().style.opacity).toEqual('0');
      done();
    }, 700);
  });

  it('Should called onAnimationEnd', (done) => {
    let num = 0;
    const handleAnimationEnd = () => {
      num += 1;
    };
    const demo = (
      <Animate
        from="1"
        to="0"
        attributeName="opacity"
        duration={500}
        onAnimationEnd={handleAnimationEnd}
      >
        <div />
      </Animate>
    );
    mount(demo);

    expect(num).toEqual(0);
    setTimeout(() => {
      expect(num).toEqual(1);
      done();
    }, 700);
  });

  it('Should change style as steps', (done) => {
    let firstStatus = 'no';
    let secondStatus = 'no';

    const firstHandleAnimationEnd = () => {
      firstStatus = 'yes';
    };
    const secondHandleAnimationEnd = () => {
      secondStatus = 'yes';
    };
    const demo = (
      <Animate
        steps={[
          {
            duration: 0,
            style: { opacity: 0 },
          },
          {
            duration: 500,
            style: { opacity: 1 },
            onAnimationEnd: firstHandleAnimationEnd,
          },
          {
            duration: 500,
            style: { opacity: 0.5 },
          },
        ]}
        onAnimationEnd={secondHandleAnimationEnd}
      >
        <div />
      </Animate>
    );
    mount(demo);

    expect(firstStatus).toEqual('no');
    expect(secondStatus).toEqual('no');
    setTimeout(() => {
      expect(firstStatus).toEqual('yes');
      expect(secondStatus).toEqual('no');
    }, 700);

    setTimeout(() => {
      expect(firstStatus).toEqual('yes');
      expect(secondStatus).toEqual('yes');
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

    expect(translatedStyle.WebkitTransform).toEqual('translateY(20px)');
    expect(translatedStyle.WebkitTransition).toEqual('-webkit-transform .4s ease');
  });
});
