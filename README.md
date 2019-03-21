# Animate

Easy React Native animations.

```
animate(
  start = 0,
  end = 0,
  duration = 0,
  easer = 'linear',
  delay = 0,
  loop = false,
  onEnd = () => {},
  onChange = () => {},
);
```

```
import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native';
import animate from 'react-native-animate';

class extends Component {

  state = {
    opacity: animate(1),
  };

  onFadeIn = () => animate(
    this.state.opacity,
    1,
    3000,
    'ease-in-out',
    1000,
    false,
    () => console.log('we are now faded in!'),
  );

  onFadeOut = () => animate(
    this.state.opacity,
    0,
    1000,
    [0.79, 0.09, 0.15, 0.98],
    0,
    false,
    () => console.log('look at that bezier curve!'),
  );

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onFadeIn}>
          Fade In
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onFadeOut}>
          Fade Out
        </TouchableOpacity>
        <Animated.View style={{ opacity: this.state.opacity }}>
          Hello World
        </Animated.View>
      </View>
    );
  }
}
```
