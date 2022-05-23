import React from 'react';
import ReactDOM from 'react-dom';
import Animate from 'react-smooth';
// import 'raf';

function Simple() {
  const [state, setState] = React.useState({
    to: 100,
  });

  const handleClick = () => {
    setState({
      to: state.to + 100,
    });
  };

  return (
    <div className="simple">
      <button onClick={handleClick}>click me!</button>
      <Animate easing="spring" from={{ y: 0 }} to={{ y: state.to }}>
        {({ y }) => (
          <div
            style={{
              width: 100,
              height: 100,
              backgroundColor: 'red',
              transform: `translate(0, ${y}px)`,
            }}
          />
        )}
      </Animate>
      <div className="graph" />
    </div>
  );
}
console.log('ReactDOM', ReactDOM);
ReactDOM.render(<Simple />, document.getElementById('app'));
