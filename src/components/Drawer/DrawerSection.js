/* @flow */

import color from 'color';
import * as React from 'react';
import { View } from 'react-native';
import DrawerItem from './DrawerItem';
import Text from '../Typography/Text';
import Divider from '../Divider';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

type Props = {
  /**
   * Title to show as the header for the section.
   */
  title?: string,
  /**
   * Content of the `DrawerSection`.
   */
  children: React.Node,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * A component to group content inside a navigation drawer.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DrawerSection } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     active: 'first',
 *   };
 *
 *   render() {
 *     const { active } = this.state;
 *
 *     return (
 *       <DrawerSection title="Some title">
 *         <DrawerSection.Item
 *           label="First Item"
 *           active={active === 'first'}
 *           onPress={() => { this.setState({ active: 'first' }); }}
 *         />
 *         <DrawerSection.Item
 *           label="Second Item"
 *           active={active === 'second'}
 *           onPress={() => { this.setState({ active: 'second' }); }}
 *         />
 *      </DrawerSection>
 *     );
 *   }
 * }
 * ```
 */
class DrawerSection extends React.Component<Props> {
  // @component ./DrawerItem.js
  static Item = DrawerItem;

  render() {
    const { children, title, theme, ...rest } = this.props;
    const { colors, fonts } = theme;
    const titleColor = color(colors.text)
      .alpha(0.54)
      .rgb()
      .string();
    const fontFamily = fonts.medium;

    return (
      <View {...rest}>
        {title && (
          <View style={{ height: 40, justifyContent: 'center' }}>
            <Text
              numberOfLines={1}
              style={{ color: titleColor, fontFamily, marginLeft: 16 }}
            >
              {title}
            </Text>
          </View>
        )}
        {children}
        <Divider style={{ marginVertical: 4 }} />
      </View>
    );
  }
}

export default withTheme(DrawerSection);
