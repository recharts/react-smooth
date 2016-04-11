import raf from 'raf';

let currTime = -1;

const shouldUpdate = (callback, timeout, now) => {
  if (currTime < 0) {
    currTime = now;
  }

  if (now - currTime > timeout) {
    callback(now);
    currTime = -1;
  } else {
    raf(shouldUpdate.bind(null, callback, timeout));
  }
}

export default function setRafTimeout(callback, timeout = 0) {
  raf(shouldUpdate.bind(null, callback, timeout));
}
