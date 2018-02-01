/* @flow */

import * as React from 'react';
import {
  Animated,
  View,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import ThemedPortal from './Portal/ThemedPortal';

type Props = {
  /**
   * Determines whether clicking outside the modal dismiss it.
   */
  dismissable?: boolean,
  /**
   * Callback that is called when the user dismisses the modal.
   */
  onRequestClose: Function,
  /**
   * Determines Whether the modal is visible.
   */
  visible: boolean,
  /**
   * Content of the `Modal`.
   */
  children: React.Node,
};

type State = {
  opacity: Animated.Value,
  rendered: boolean,
};

/**
 * The Modal component is a simple way to present content above an enclosing view.
 *
 * ## Usage
 * ```js
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _showModal = () => this.setState({ visble: true });
 *   _hideModal = () => this.setState({ visble: false });
 *
 *   render() {
 *     const { visible } = this.state;
 *     return (
 *       <Modal visible={visible}>
 *         <Text>Example Modal</Text>
 *       </Modal>
 *     );
 *   }
 * }
 * ```
 */

export default class Modal extends React.Component<Props, State> {
  static defaultProps = {
    dismissable: true,
    visible: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(props.visible ? 1 : 0),
      rendered: props.visible,
    };
  }

  state: State;

  componentWillReceiveProps({ visible }: Props) {
    if (this.props.visible !== visible) {
      if (visible) {
        this.setState({
          rendered: true,
        });
      }
    }
  }

  componentDidUpdate({ visible }: Props) {
    if (visible !== this.props.visible) {
      if (this.props.visible) {
        this._showModal();
      } else {
        this._hideModal();
      }
    }
  }

  _handleBack = () => {
    if (this.props.dismissable) {
      this._hideModal();
    }
    return true;
  };

  _showModal = () => {
    BackHandler.addEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 280,
      easing: Easing.ease,
    }).start();
  };

  _hideModal = () => {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 280,
      easing: Easing.ease,
    }).start(() => {
      if (this.props.visible && this.props.onRequestClose) {
        this.props.onRequestClose();
      }
      if (this.props.visible) {
        this._showModal();
      } else {
        this.setState({
          rendered: false,
        });
      }
    });
  };

  render() {
    if (!this.state.rendered) return null;

    const { children, dismissable } = this.props;
    return (
      <ThemedPortal>
        <Animated.View
          style={[{ opacity: this.state.opacity }, styles.wrapper]}
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(0, 0, 0, .5)' },
            ]}
          />
          {dismissable && (
            <TouchableWithoutFeedback onPress={this._hideModal}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
          )}
          <Animated.View style={[{ opacity: this.state.opacity }]}>
            {children}
          </Animated.View>
        </Animated.View>
      </ThemedPortal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});
