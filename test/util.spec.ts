import { getIntersectionKeys, getDashCase, mapObject, getTransitionVal, warn } from '../src/util';

describe('getIntersectionKeys', () => {
  it('should return which keys intersect between two objects', () => {
    const from = { a: 1, b: 2, c: 3 };
    const to = { b: 4, c: 5, d: 6 };

    const keys = getIntersectionKeys(from, to);

    expect(keys).toEqual(['b', 'c']);
  });
});

describe('getDashCase', () => {
  it('should convert camel case to dash (kebab) case', () => {
    const someString = 'someString';

    const dashCase = getDashCase(someString);

    expect(dashCase).toEqual('some-string');
  });

  it('should convert a complex camel case to dash (kebab) case', () => {
    const someString = 'someStringTHATHasALotofVariationInIT';

    const dashCase = getDashCase(someString);

    expect(dashCase).toEqual('some-string-t-h-a-t-has-a-lotof-variation-in-i-t');
  });
});

describe('mapObject', () => {
  it('should return a new identical object if the value is returned from the fn', () => {
    const input = { a: 1, b: 2, c: 3 };

    const res = mapObject((key: string, value: number) => {
      return value;
    }, input);

    expect(res).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  it('should return an object where the keys are the value and the key', () => {
    const input = { a: 1, b: 2, c: 3 };

    const res = mapObject((key: string, value: number) => {
      return key;
    }, input);

    expect(res).toEqual({
      a: 'a',
      b: 'b',
      c: 'c',
    });
  });
});

describe('getTransitionVal', () => {
  it('should return the correct transition value for a single property', () => {
    const result = getTransitionVal(['opacity'], '300', 'ease-in');
    expect(result).toBe('opacity 300ms ease-in');
  });

  it('should return the correct transition value for multiple properties', () => {
    const result = getTransitionVal(['opacity', 'transform'], '300', 'ease-in');
    expect(result).toBe('opacity 300ms ease-in,transform 300ms ease-in');
  });

  it('should handle an empty array of properties', () => {
    const result = getTransitionVal([], '300', 'ease-in');
    expect(result).toBe('');
  });

  it('should handle different durations and easings', () => {
    const result = getTransitionVal(['opacity', 'transform'], '500', 'linear');
    expect(result).toBe('opacity 500ms linear,transform 500ms linear');
  });

  it('should correctly format property names using dash-case', () => {
    const result = getTransitionVal(['backgroundColor', 'transform'], '200', 'ease-out');
    expect(result).toBe('background-color 200ms ease-out,transform 200ms ease-out');
  });
});

describe('warn', () => {
  let originalConsoleWarn;

  beforeEach(() => {
    // Backup the original console.warn
    originalConsoleWarn = console.warn;
    // Mock console.warn
    console.warn = vi.fn();
  });

  afterEach(() => {
    // Restore the original console.warn
    console.warn = originalConsoleWarn;
    vi.unstubAllEnvs();
  });

  it('should not log anything if in production environment', () => {
    // Set environment to production
    vi.stubEnv('NODE_ENV', 'production');
    warn(false, 'This should not be logged');
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should log an error message when format is undefined', () => {
    // Set environment to development
    process.env.NODE_ENV = 'development';
    // @ts-expect-error - testing undefined format
    warn(false);
    expect(console.warn).toHaveBeenCalledWith(
      `Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.`,
    );
  });

  it('should not log anything if the condition is true', () => {
    // Set environment to development
    process.env.NODE_ENV = 'development';
    warn(true, 'This should not be logged');
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should log the default error message when condition is false and format is undefined', () => {
    // Set environment to development
    process.env.NODE_ENV = 'development';
    // @ts-expect-error - testing undefined format
    warn(false);
    expect(console.warn).toHaveBeenCalledWith(`LogUtils requires an error message argument`);
    expect(console.warn).toHaveBeenCalledWith(
      `Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.`,
    );
  });

  it('should log formatted message when condition is false and format is defined', () => {
    // Set environment to development
    process.env.NODE_ENV = 'development';
    const format = 'Error: %s %s';
    const arg1 = 'arg1';
    const arg2 = 'arg2';
    warn(false, format, arg1, arg2);
    expect(console.warn).toHaveBeenCalledWith('Error: arg1 arg2');
  });

  it('should handle multiple arguments correctly', () => {
    // Set environment to development
    process.env.NODE_ENV = 'development';
    const format = 'Error: %s %s %s %s %s %s';
    const args = ['arg1', 'arg2', 'arg3', 'arg4', 'arg5', 'arg6'];
    warn(false, format, ...args);
    expect(console.warn).toHaveBeenCalledWith('Error: arg1 arg2 arg3 arg4 arg5 arg6');
  });
});
