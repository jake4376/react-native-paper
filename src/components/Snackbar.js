/* @flow */

import * as React from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

import ThemedPortal from './Portal/ThemedPortal';
import withTheme from '../core/withTheme';
import { white } from '../styles/colors';
import type { Theme } from '../types';

type Props = {
  /**
   * Whether the Snackbar is currently visible.
   */
  visible: boolean,
  /**
   * Label and press callback for the action button. It should contains following properties:
   * - `label` - Label of the action button
   * - `onPress` - Callback that is called when action button is pressed.
   */
  action?: {
    label: string,
    onPress: () => mixed,
  },
  /**
   * The duration for which the Snackbar is shown.
   */
  duration?: number,
  /**
   * Callback called when Snackbar is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => mixed,
  /**
   * Text content of the Snackbar.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  rendered: boolean,
  height: number,
  opacity: Animated.Value,
  translateY: Animated.Value,
};

const SNACKBAR_ANIMATION_DURATION = 250;

/**
 * Snackbar provide brief feedback about an operation through a message at the bottom of the screen.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/snackbar.gif" />
 * </div>
 *
 * ## Usage
 * ```js
 * import React from 'react';
 * import { Snackbar, StyleSheet } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   render() {
 *     const { visible } = this.state;
 *     return (
 *       <View style={styles.container}>
 *         <Button
 *           raised
 *           onPress={() => this.setState(state => ({ visible: !state.visible }))}
 *         >
 *           {this.state.visible ? 'Hide' : 'Show'}
 *         </Button>
 *         <Snackbar
 *           visible={this.state.visible}
 *           onDismiss={() => this.setState({ visible: false })}
 *           action={{
 *             label: 'Undo',
 *             onPress: () => {
 *               // Do something
 *             },
 *           }}
 *         >
 *           Hey there! I'm a Snackbar.
 *         </Snackbar>
 *       </View>
 *     );
 *   }
 * }
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     flex: 1,
 *     justifyContent: 'space-between',
 *   },
 * });
 * ```
 */
class Snackbar extends React.Component<Props, State> {
  /**
   * Show the Snackbar for a short duration.
   */
  static DURATION_SHORT = 2000;

  /**
   * Show the Snackbar for a long duration.
   */
  static DURATION_LONG = 3500;

  /**
   * Show the Snackbar for indefinite amount of time.
   */
  static DURATION_INDEFINITE = Infinity;

  static defaultProps = {
    duration: this.DURATION_LONG,
  };

  state = {
    rendered: false,
    height: 0,
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(0),
  };

  componentDidMount() {
    if (this.props.visible) {
      this._show();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this._show();
      } else {
        this._hide();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this._hideTimeout);
  }

  _hideTimeout: TimeoutID;

  _handleLayout = e => {
    const { height } = e.nativeEvent.layout;

    this.setState({
      height,
      rendered: true,
    });

    this.state.translateY.setValue(height);
  };

  _show = () => {
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.translateY, {
        toValue: 0,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const { duration } = this.props;

      if (duration !== Snackbar.DURATION_INDEFINITE) {
        this._hideTimeout = setTimeout(this.props.onDismiss, duration);
      }
    });
  };

  _hide = () => {
    clearTimeout(this._hideTimeout);

    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.translateY, {
        toValue: this.state.height,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  render() {
    const { children, action, onDismiss, theme, style } = this.props;
    const { fonts, colors } = theme;

    const buttonMargin = action ? 24 : 0;
    const contentRightMargin = action ? 0 : 24;

    return (
      <ThemedPortal>
        <Animated.View
          onLayout={this._handleLayout}
          style={[
            styles.wrapper,
            {
              opacity: this.state.rendered ? 1 : 0,
              transform: [
                {
                  translateY: this.state.translateY,
                },
              ],
            },
            style,
          ]}
        >
          <Animated.View
            style={[
              styles.container,
              {
                opacity: this.state.opacity.interpolate({
                  inputRange: [0, 0.8, 1],
                  outputRange: [0, 0.2, 1],
                }),
              },
            ]}
          >
            <Text
              style={[
                styles.content,
                {
                  fontFamily: fonts.regular,
                  marginRight: contentRightMargin,
                },
              ]}
            >
              {children}
            </Text>
            {action ? (
              <View
                style={{
                  marginHorizontal: buttonMargin,
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    action.onPress();
                    onDismiss();
                  }}
                >
                  <View>
                    <Text style={{ color: colors.accent }}>
                      {action.label.toUpperCase()}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : null}
          </Animated.View>
        </Animated.View>
      </ThemedPortal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#323232',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 6,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    color: white,
    marginLeft: 24,
    marginVertical: 14,
    flexWrap: 'wrap',
    flex: 1,
  },
});

export default withTheme(Snackbar);
