/* @flow */

import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import color from 'color';
import withTheme from '../core/withTheme';
import Icon from './Icon';
import TouchableIcon from './TouchableIcon';
import Paper from './Paper';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  /**
   * Hint text shown when the input is empty.
   */
  placeholder?: string,
  /**
   * The value of the text input.
   */
  value: string,
  /**
   * Icon name for the left icon button (see `onIconPress`).
   */
  icon?: IconSource,
  /**
   * Callback that is called when the text input's text changes.
   */
  onChangeText: (query: string) => void,
  /**
   * Callback to execute if we want the left icon to act as button.
   */
  onIconPress?: Function,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * SearchBar is a simple input box where users can type search queries.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/searchbar.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import React from 'react';
 * import { SearchBar } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     firstQuery: '',
 *   };
 *
 *   render() {
 *     const { firstQuery } = this.state;
 *     return (
 *       <SearchBar
 *         placeholder="Search"
 *         onChangeText={query => { this.setState({ firstQuery: query }); }}
 *         value={firstQuery}
 *       />
 *     );
 *   }
 * }
 * ```
 */
class SearchBar extends React.Component<Props> {
  _handleClearPress = () => {
    this.props.onChangeText('');
  };

  render() {
    const {
      placeholder,
      onIconPress,
      icon,
      value,
      theme,
      style,
      ...rest
    } = this.props;
    const { colors, roundness, dark } = theme;
    const textColor = colors.text;
    const iconColor = dark
      ? textColor
      : color(textColor)
          .alpha(0.54)
          .rgb()
          .string();
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <Paper
        style={[
          { borderRadius: roundness, elevation: 4 },
          styles.container,
          style,
        ]}
      >
        {onIconPress ? (
          <TouchableIcon
            borderless
            rippleColor={rippleColor}
            onPress={onIconPress}
            iconStyle={[styles.icon, { color: iconColor }]}
            name={icon || 'search'}
          />
        ) : (
          <Icon
            style={[styles.icon, { color: iconColor }]}
            name="search"
            size={24}
          />
        )}
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder || ''}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          value={value}
          {...rest}
        />
        {value ? (
          <TouchableIcon
            borderless
            rippleColor={rippleColor}
            onPress={this._handleClearPress}
            iconStyle={[styles.icon, { color: iconColor }]}
            name="close"
          />
        ) : null}
      </Paper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingLeft: 8,
  },
  icon: {
    margin: 12,
  },
});

export default withTheme(SearchBar);
