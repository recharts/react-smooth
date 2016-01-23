# ReAnimate
ReAnimate = React + Animate

[![npm version](https://badge.fury.io/js/re-animate.png)](https://badge.fury.io/js/re-animate)
[![build status](https://travis-ci.org/recharts/reanimate.svg)](https://travis-ci.org/recharts/reanimate)

## install
```
npm i --save re-animate
```

## Usage
```jsx
<Animate to="0" attributeName="opacity">
  <div>
</Animate>
```
or
```js
const steps = [{
  style: {
    opacity: 0,
  },
  moment: 400,
}, {
  style: {
    opacity: 1,
    transform: 'translate(0, 0)',
  },
  moment: 1000,
}, {
  style: {
    transform: 'translate(100px, 100px)',
  },
  moment: 1200,
}];
```

```jsx
<Animate steps={steps}>
  <div>
</Animate>
```

## API

### props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 50px">name</th>
        <th style="width: 100px">type</th>
        <th style="width: 50px">default</th>
        <th style="width: 50px">description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>from</td>
          <td>string or object</td>
          <td>''</td>
          <td>set the initial style of the children</td>
        </tr>
        <tr>
          <td>to</td>
          <td>string or object</td>
          <td>''</td>
          <td>set the final style of the children</td>
        </tr>
        <tr>
          <td>canBegin</td>
          <td>boolean</td>
          <td>true</td>
          <td>whether the animation is start</td>
        </tr>
        <tr>
          <td>begin</td>
          <td>number</td>
          <td>0</td>
          <td>animation delay time</td>
        </tr>
        <tr>
          <td>duration</td>
          <td>number</td>
          <td>1000</td>
          <td>animation duration</td>
        </tr>
        <tr>
          <td>steps</td>
          <td>array</td>
          <td>[]</td>
          <td>animation keyframes</td>
        </tr>
        <tr>
          <td>onAnimationEnd</td>
          <td>function</td>
          <td>() => {}</td>
          <td>called when animation finished</td>
        </tr>
        <tr>
          <td>attributeName</td>
          <td>string</td>
          <td>''</td>
          <td>style property</td>
        </tr>
        <tr>
          <td>easing</td>
          <td>string</td>
          <td>'ease'</td>
          <td>the animation timing function, support css timing function temporary</td>
        </tr>
        <tr>
          <td>isActive</td>
          <td>boolean</td>
          <td>true</td>
          <td>whether the animation is active</td>
        </tr>
        <tr>
          <td>children</td>
          <td>element</td>
          <td></td>
          <td>support only child temporary</td>
        </tr>
    </tbody>
</table>

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2015-2016 Recharts Group
