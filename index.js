import { Animated, Easing } from 'react-native';

const startKey = `__${Math.ceil(Math.random() * 10000000000)}`;
const stopKey = `__${Math.ceil(Math.random() * 10000000000)}`;

const getEasing = easer => {
  if (typeof easer === 'string') {
    if (easer.includes(' ')) {
      return Easing.bezier(...easer.split(/,?[ ]+/).map(v => +v || 0));
    }
    switch (easer) {
      case 'ease-in':
        return Easing.bezier(0.42, 0, 1, 1);
      case 'ease-out':
       return Easing.bezier(0, 0, 0.58, 1);
      case 'ease-in-out':
        return Easing.bezier(0.42, 0, 0.58, 1);
    }
    if (Easing[easer]) {
      return Easing[easer];
    }
  }
  if (
    typeof easer === 'object'
    && easer.length === 4
  ) {
    return Easing.bezier(...easer);
  }
  return Easing.linear;
};

const getValue = (value, fromLoop) => {
  if (value && typeof value === 'object') {
    if (fromLoop !== -1 && value[stopKey]) {
      value[stopKey]();
    }
    return value;
  }
  const animatedValue = new Animated.Value(value);
  animatedValue[startKey] = value;
  return animatedValue;
};

export const animate = (...args) => {
  const [
    start = 0,
    end = 0,
    duration = 0,
    easer = '',
    delay = 0,
    loop = false,
    onEnd = null,
    onChange = null,
    fromLoop = 0,
  ] = args;
  const value = getValue(start, fromLoop);
  if (value.initialStart === undefined) {
    value.initialStart = start;
    value.initialEnd = end;
  }
  let timing = null;
  value.removeAllListeners();
  if (args.length === 1) {
    return value;
  }
  if (onChange) {
    value.addListener(event => onChange(event.value));
  }
  if (duration <= 0) {
    value.setValue(end);
    if (onEnd) {
      setTimeout(() => onEnd(end));
    }
  } else {
    timing = Animated.timing(
      value,
      {
        toValue: end,
        delay,
        duration,
        useNativeDriver: true,
        easing: getEasing(easer),
      },
    );
    let stopped = false;
    value[stopKey] = () => {
      stopped = true;
      timing.stop();
    };
    timing.start(() => {
      if (loop) {
        value.setValue(value[startKey]);
        animate(value, end, duration, easer, delay, loop, onEnd, onChange, -1);
      } else if (!stopped && onEnd) {
        onEnd(end);
      }
    });
  }
  value.timing = timing;
  value.translate = (...args) => translate(value, ...args);
  value.pause = (...args) => pause(value, ...args);
  value.play = (...args) => play(value, ...args);
  return value;
};

export const pause = input => {
  const value = getValue(input);
  const timing = value.timing;
  if (timing) {
    timing.stop();
  }
};

export const play = input => {
  const value = getValue(input);
  const timing = value.timing;
  if (timing) {
    timing.start();
  }
};

export const translate = (input, toMin, toMax) => {
  const value = getValue(input);
  return value.interpolate({
    inputRange: [value.initialStart, value.initialEnd],
    outputRange: [toMin, toMax],
  });
};

export default animate;