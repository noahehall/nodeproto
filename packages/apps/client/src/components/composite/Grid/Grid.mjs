// @flow strict

import { unstable_Grid as Grid, unstable_useGridState as useGridState } from 'reakit/Grid';
import * as React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '../Errors/ErrorBoundary.mjs';
import styled from 'styled-components';

const StyledGrid = styled(Grid)`
  /* display: flex;
  flex-flow: nowrap column; */
`;

type ScreenGridNativeProps = {
  children: React.Node,
  className?: string,
  isFor: string,
};

export function ScreenGridNative ({
  isFor = 'Nirv',
  className,
  children,
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

export default function ScreenGrid ({ children, className, isFor }: ScreenGridNativeProps): React.Node {
  return (
    <ErrorBoundary>
      <ScreenGridNative className={className} isFor={isFor}>
        {children}
      </ScreenGridNative>
    </ErrorBoundary>
  );
}

if (module.hot?.accept) module.hot.accept(); // eslint-disable-line no-undef
