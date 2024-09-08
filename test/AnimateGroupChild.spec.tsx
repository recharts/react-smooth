import React, { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import AnimateGroupChild from '../src/AnimateGroupChild';

describe('AnimateGroupChild', () => {
  it('Should render AnimateGroupChild and its children', () => {
    const { container } = render(
      <AnimateGroupChild>
        <div />
      </AnimateGroupChild>,
    );

    const isDiv = container.firstChild instanceof HTMLDivElement;
    expect(isDiv).toBe(true);
  });

  it('Should render AnimateGroupChild with basic options set', () => {
    const appearOptions = { duration: 0.5, steps: [] };
    const leaveOptions = { duration: 0.5, steps: [{ duration: 0.2 }] };
    const enterOptions = { duration: 0.5, steps: [{ duration: 0.2 }, { duration: 0.4 }] };
    const { container } = render(
      <AnimateGroupChild appearOptions={appearOptions} leaveOptions={leaveOptions} enterOptions={enterOptions}>
        <div />
      </AnimateGroupChild>,
    );
  });

  const Example = ({ enterOptions, inPropDefault }) => {
    const [inProp, setInProp] = useState(inPropDefault);

    const appearOptions = { duration: 0.5, steps: [] };
    const leaveOptions = { duration: 0.5, steps: [{ duration: 0.2, style: { opacity: 0 } }] };

    return (
      <>
        <button type="button" onClick={() => setInProp(p => !p)}>
          click me
        </button>
        <AnimateGroupChild
          in={inProp}
          appearOptions={appearOptions}
          leaveOptions={leaveOptions}
          enterOptions={enterOptions}
        >
          <div />
        </AnimateGroupChild>
      </>
    );
  };

  it('Should render AnimateGroupChild and trigger enter state with custom onAnimationEnd', () => {
    const enterOptions = {
      duration: 0.5,
      steps: [
        { duration: 0.2, style: { opacity: 10 } },
        { duration: 0.4, style: { opacity: 10 } },
      ],
      onAnimationEnd: vi.fn(),
    };

    render(<Example enterOptions={enterOptions} inPropDefault={false} />);
    // enter state triggered
    act(() => {
      screen.getByText('click me').click();
    });
  });

  it('Should render AnimateGroupChild and trigger enter state without custom onAnimationEnd', () => {
    const enterOptions = {
      duration: 0.5,
      steps: [
        { duration: 0.2, style: { opacity: 10 } },
        { duration: 0.4, style: { opacity: 10 } },
      ],
    };
    render(<Example enterOptions={enterOptions} inPropDefault={false} />);
    // enter state triggered
    act(() => {
      screen.getByText('click me').click();
    });
  });

  it('Should render AnimateGroupChild and trigger exit state', () => {
    const enterOptions = { duration: 0.5, steps: [{ duration: 0.2, style: { opacity: 0 } }, { duration: 0.4 }] };
    render(<Example enterOptions={enterOptions} inPropDefault={true} />);
    // enter state triggered
    act(() => {
      screen.getByText('click me').click();
    });
  });
});
