import { configBezier, configSpring, configEasing } from '../src/easing';
import * as util from '../src/util';

vi.mock('../src/util', () => ({
  warn: vi.fn(),
}));

describe('configBezier', () => {
  it('should return a cubic-bezier function for valid arguments', () => {
    const bezier = configBezier(0.42, 0, 0.58, 1);
    expect(typeof bezier).toBe('function');
    expect(bezier(0.5)).toBeCloseTo(0.5, 4);
  });

  it('should handle named easing functions', () => {
    const ease = configBezier('ease');
    const linear = configBezier('linear');

    expect(ease).toBeInstanceOf(Function);
    expect(linear).toBeInstanceOf(Function);

    expect(ease(0.5)).toEqual(0.8024033875848569);
    expect(linear(0.5)).toBeCloseTo(0.5, 4);
  });

  it('should handle invalid inputs and default return bezier function', () => {
    const warn = vi.spyOn(util, 'warn');
    const bezier = configBezier('invalid');
    expect(bezier).toBeInstanceOf(Function);
    expect(warn).toHaveBeenCalledWith(
      false,
      '[configBezier]: arguments should be x1, y1, x2, y2 of [0, 1] instead received %s',
      ['invalid'],
    );
  });
});

describe('configSpring', () => {
  it('should return a stepper function with default config', () => {
    const spring = configSpring();
    expect(typeof spring).toBe('function');
    expect(spring.isStepper).toBe(true);
    expect(spring.dt).toBe(17);

    // Test stepper with some inputs
    const [newX, newV] = spring(0, 1, 0);
    expect(newX).toBeDefined();
    expect(newV).toBeDefined();
  });

  it('should handle custom config', () => {
    const customSpring = configSpring({ stiff: 200, damping: 10, dt: 20 });
    expect(customSpring.dt).toBe(20);

    // Test stepper with some inputs
    const [newX, newV] = customSpring(0, 1, 0);
    expect(newX).toBeDefined();
    expect(newV).toBeDefined();
  });
});

describe('configEasing', () => {
  it('should return the correct bezier function for named easing', () => {
    const easing = configEasing('ease');
    expect(easing).toBeInstanceOf(Function);
  });

  it('should return the correct spring function', () => {
    const spring = configEasing('spring');
    expect(spring).toBeInstanceOf(Function);
    expect(spring.isStepper).toBe(true);
  });

  it('should handle cubic-bezier input', () => {
    const bezier = configEasing('cubic-bezier(0.42,0,0.58,1)');
    expect(bezier).toBeInstanceOf(Function);
    expect(bezier(0.5)).toEqual(0.5);
  });

  it('should return null for invalid inputs', () => {
    const warn = vi.spyOn(util, 'warn');
    const result = configEasing('invalid');
    expect(result).toBeNull();
    expect(warn).toHaveBeenCalledWith(false, expect.stringContaining('first argument should be one of'), ['invalid']);
  });

  it('should handle function inputs', () => {
    const customFunc = () => {};
    const result = configEasing(customFunc);
    expect(result).toBe(customFunc);
  });
});
