import React from 'react';
import { render } from '@testing-library/react';
import AnimateGroup from '../src/AnimateGroup';

describe('AnimateGroup', () => {
  it('Should render AnimateGroup', () => {
    render(<AnimateGroup />);
  });

  it('Should render children wrapped in the default component span', () => {
    const { container } = render(
      <AnimateGroup>
        <div></div>
        <div></div>
      </AnimateGroup>,
    );

    const isSpan = container.firstChild instanceof HTMLSpanElement;
    expect(isSpan).toBe(true);
  });

  it('Should render children wrapped in provided component type div', () => {
    const { container } = render(
      <AnimateGroup component="div">
        <div></div>
        <div></div>
      </AnimateGroup>,
    );

    const isDiv = container.firstChild instanceof HTMLDivElement;
    expect(isDiv).toBe(true);
  });
});
