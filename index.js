import { Animated, Easing } from 'react-native';

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

const getValue = value => {
  if (value && typeof value === 'object') {
    if (value[stopKey]) {
      value[stopKey]();
    }
    return value;
  }
  return new Animated.Value(value);
};

export default (
  start = 0,
  end = 0,
  duration = 0,
  easer = '',
  delay = 0,
  callback = () => {},
) => {
  const value = getValue(start);
  if (duration <= 0) {
    value.setValue(end);
    setTimeout(() => callback(end));
  } else {
    const timing = Animated.timing(
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
    timing.start(() => !stopped && callback(end));
  }
  return value;
};