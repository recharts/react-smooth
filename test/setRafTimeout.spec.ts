import setRafTimeout from '../src/setRafTimeout';

describe('setRafTimeout', () => {
  it('should call setRafTimeout', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(window, 'requestAnimationFrame');
    const cb = vi.fn();
    setRafTimeout(cb);
    vi.runAllTimers();
    expect(cb).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call requestAnimationFrame with a 1 second delay', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(window, 'requestAnimationFrame');
    const cb = vi.fn();
    setRafTimeout(cb, 1000);
    expect(cb).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
