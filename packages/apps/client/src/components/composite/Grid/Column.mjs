// @flow

import * as React from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import {
  unstable_GridCell as GridCell,
  unstable_useGridState as useGridState,
} from 'reakit/Grid';

const StyledCell = styled(GridCell)`

`;

export type ScreenColumnProps = {
  className?: string,
  children: React.Node,
  props?: Array<any>,
};

export function ScreenColumn ({ className, children, ...props }: ScreenColumnProps): React.Node {
  const grid = useGridState();

  return (
    <StyledCell
      {...grid} className={clsx(
        'column',
        className
      )}
    >
      {children}
    </StyledCell>
  );
}

if (module.hot?.accept) module.hot.accept();
