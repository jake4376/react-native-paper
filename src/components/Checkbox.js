/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform, View, StyleSheet } from 'react-native';
import color from 'color';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

type Props = {
  /**
   * Whether checkbox is checked
   */
  checked: boolean,
  /**
   * Whether checkbox is disabled
   */
  disabled?: boolean,
  /**
   * Function to execute on press
   */
  onPress?: Function,
  /**
   * Custom color for checkbox
   */
  color?: string,
  theme: Theme,
};

type State = {
  scaleAnim: Animated.Value,
  checkAnim: Animated.Value,
};

/**
 * Checkboxes allow the selection of multiple options from a set
 */
class Checkbox extends Component<void, Props, State> {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    color: PropTypes.string,
    theme: PropTypes.object.isRequired,
  };

  state = {
    scaleAnim: new Animated.Value(1),
    checkAnim: new Animated.Value(1),
  };

  componentDidMount() {
    this.state.checkAnim.setValue(this.props.checked ? 1 : 0);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.checked !== this.props.checked) {
      if (Platform.OS === 'android') {
        Animated.parallel([
          Animated.timing(this.state.checkAnim, {
            toValue: nextProps.checked ? 1 : 0,
            duration: 450,
          }),
          Animated.sequence([
            Animated.timing(this.state.scaleAnim, {
              toValue: 0.85,
              duration: nextProps.checked ? 0 : 200,
            }),
            Animated.timing(this.state.scaleAnim, {
              toValue: 1,
              duration: nextProps.checked ? 350 : 200,
            }),
          ]),
        ]).start();
      }
    }
  }

  render() {
    const { checked, disabled, onPress, theme, ...rest } = this.props;
    const checkedColor = this.props.color || theme.colors.accent;
    const uncheckedColor = 'rgba(0, 0, 0, .54)';

    let rippleColor, checkboxColor;

    if (disabled) {
      rippleColor = 'rgba(0, 0, 0, .16)';
      checkboxColor = theme.colors.disabled;
    } else {
      rippleColor = color(checkedColor)
        .clearer(0.32)
        .rgbaString();
      checkboxColor = checked ? checkedColor : uncheckedColor;
    }

    const borderWidth = this.state.scaleAnim.interpolate({
      inputRange: [0.8, 1],
      outputRange: [7, 0],
    });

    return (
      <TouchableRipple
        {...rest}
        borderless
        rippleColor={rippleColor}
        onPress={disabled ? undefined : onPress}
        style={styles.container}
      >
        <Animated.View style={{ transform: [{ scale: this.state.scaleAnim }] }}>
          <Icon
            allowFontScaling={false}
            name={checked ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            style={[styles.icon, { color: checkboxColor }]}
          />
          <View style={[StyleSheet.absoluteFill, styles.fillContainer]}>
            <Animated.View
              style={[
                styles.fill,
                { borderColor: checkboxColor },
                { borderWidth },
              ]}
            />
          </View>
        </Animated.View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },
  icon: {
    margin: 6,
  },
  fillContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    height: 14,
    width: 14,
  },
});

export default withTheme(Checkbox);
