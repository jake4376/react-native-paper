/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import StyledText from './StyledText';

type Props = {
  style?: any,
};

/**
 * Typography component for showing a headline.
 *
 * ## Usage
 * ```js
 * const MyComponent = () => (
 *   <Headline>Headline</Headline>
 * );
 * ```
 */
const Headline = (props: Props) => (
  <StyledText
    {...props}
    alpha={0.87}
    family="regular"
    style={[styles.text, props.style]}
  />
);

export default Headline;

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    lineHeight: 32,
    marginVertical: 2,
  },
});
