// @flow

import clsx from 'clsx';
import ErrorBoundary from '../Errors/ErrorBoundary.mjs';
import * as React from 'react';
import styled from 'styled-components';
import {
  unstable_Grid as Grid,
  unstable_useGridState as useGridState,
} from 'reakit/Grid';

const StyledGrid = styled(Grid)`
  /* display: flex;
  flex-flow: nowrap column; */
`;

export type ScreenGridNativeProps = {
  children: React.Node,
  className?: string,
  isFor: string,
  props?: Array<any>,
};

export function ScreenGridNative ({
  isFor = 'Nirv',
  className,
  children,

  ...props
}: ScreenGridNativeProps): React.Node {
  const grid = useGridState();

  return (
    <StyledGrid
      {...grid} aria-label={`${isFor} grid`} className={clsx(
        'container',
        className
      )}
    >
      {children}
    </StyledGrid>
  );
}

export function ScreenGrid (props: ScreenGridNativeProps): React.Node {
  return <ErrorBoundary><ScreenGridNative {...props} /></ErrorBoundary>;
}

if (module.hot?.accept) module.hot.accept();
