import React from 'react';
import { render } from '@testing-library/react';
import AnimateGroupChild from '../src/AnimateGroupChild';

describe('AnimateGroupChild', () => {
  it('Should render AnimateGroupChild', () => {
    render(
      <AnimateGroupChild>
        <div />
      </AnimateGroupChild>,
    );
  });
});
