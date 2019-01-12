# Animate

Easy React Native animations.

```
animate(
  start = 0,
  end = 0,
  duration = 0,
  easer = 'linear',
  delay = 0,
  callback = () => {},
);
```

```
import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native';
import animate from 'react-native-animate';

class extends Component {

  state = {
    opacity: 1,
  };

  onFadeIn = () => this.setState({
    opacity: animate(
      this.state.opacity,
      1,
      3000,
      'ease-in-out',
      1000,
      () => console.log('we are now faded in!'),
    ),
  });

  onFadeOut = () => this.setState({
    opacity: animate(
      this.state.opacity,
      0,
      1000,
      [0.79, 0.09, 0.15, 0.98],
      0,
      () => console.log('look at that bezier curve!'),
    ),
  });

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
