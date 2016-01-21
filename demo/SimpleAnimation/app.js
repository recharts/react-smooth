import Animate from 're-animate';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

const Simple = props => (
  <div>
    <Animate to="0.2" attributeName="opacity" easing="ease-in-out">
      <div style={{ width: 100, height: 100, backgroundColor: 'red' }}></div>
    </Animate>
    <Animate begin={2000} from="0.8" to="0.2" attributeName="opacity">
      <div style={{ width: 100, height: 100, backgroundColor: 'red' }}></div>
    </Animate>
    <Animate begin={3000} from={{ opacity: 0.8 }} to={{ opacity: 0.2 }}>
      <div style={{ width: 100, height: 100, backgroundColor: 'red' }}></div>
    </Animate>
  </div>
);

ReactDom.render(<Simple />, document.getElementById('app'));
