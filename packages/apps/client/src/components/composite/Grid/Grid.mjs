// @flow

import {
  unstable_Grid as Grid,
  unstable_useGridState as useGridState
} from 'reakit/Grid';

import clsx from 'clsx';
import styled from '@emotion/styled';

import { ErrorBoundary } from '../Errors/ErrorBoundary.mjs';

import type { ComponentType, Element, Node } from '../../../../libdefs';

const StyledGrid: ComponentType<void> = styled(Grid)`
  /* display: flex;
  flex-flow: nowrap column; */
`;

type ScreenGridProps = {
  children: ?Node,
  className?: string,
  isFor?: string,
};

export const ScreenGridNative: ComponentType<ScreenGridProps> = ({
  children,
  className,
  isFor = 'Nirv',
} = {}): Element<typeof StyledGrid> => {
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
};

export const ScreenGrid: ComponentType<ScreenGridProps> = ({ children, className, isFor } = {}): Element<typeof ErrorBoundary> =>{
  return (
    <ErrorBoundary>
      <ScreenGridNative className={className} isFor={isFor}>
        {children}
      </ScreenGridNative>
    </ErrorBoundary>
  );
};

// if (module.hot?.accept) module.hot.accept(); // eslint-disable-line no-undef
