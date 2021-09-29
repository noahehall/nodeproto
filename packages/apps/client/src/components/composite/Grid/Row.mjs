// @flow

import clsx from 'clsx';
import * as React from 'react';
import styled from 'styled-components';
import {
  unstable_GridRow as GridRow,
  unstable_useGridState as useGridState,
} from 'reakit/Grid';

// TODO: figure out this type
const StyledRow = styled(GridRow)`

`;

export type ScreenRowProps = {
  className?: string,
  children: React.Node,
  props?: Array<any>,
}

export function ScreenRow ({ className, children, ...props }: ScreenRowProps): React.Node {
  const grid = useGridState();

  return (
    <StyledRow
      {...grid} className={clsx(
        'row',
        className
      )}
    >
      {children}
    </StyledRow>
  );
}

if (module.hot?.accept) module.hot.accept();
