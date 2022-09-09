"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactTransitionGroup = require("react-transition-group");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AnimateGroupChild = _interopRequireDefault(require("./AnimateGroupChild"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function AnimateGroup(props) {
  var component = props.component,
      children = props.children,
      appear = props.appear,
      enter = props.enter,
      leave = props.leave;
  return /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.TransitionGroup, {
    component: component
  }, _react.Children.map(children, function (child, index) {
    return /*#__PURE__*/_react.default.createElement(_AnimateGroupChild.default, {
      appearOptions: appear,
      enterOptions: enter,
      leaveOptions: leave,
      key: "child-".concat(index) // eslint-disable-line

    }, child);
  }));
}

AnimateGroup.propTypes = {
  appear: _propTypes.default.object,
  enter: _propTypes.default.object,
  leave: _propTypes.default.object,
  children: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.element]),
  component: _propTypes.default.any
};
AnimateGroup.defaultProps = {
  component: 'span'
};
var _default = AnimateGroup;
exports.default = _default;