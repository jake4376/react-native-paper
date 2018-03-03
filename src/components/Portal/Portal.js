/* @flow */
/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';
import PortalConsumer from './PortalConsumer';
import { PortalContext } from './PortalHost';

export type PortalProps = {
  /**
   * Position of the element in the z-axis
   */
  position?: number,
  /**
   * Content of the `Portal`.
   */
  children: React.Node,
};

/**
 * Portal allows to render a component at a different place in the parent tree.
 */
export default function Portal(props: PortalProps) {
  return (
    <PortalContext.Consumer>
      {manager => <PortalConsumer manager={manager} props={props} />}
    </PortalContext.Consumer>
  );
}
