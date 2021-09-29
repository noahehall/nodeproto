// @flow

import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';
import {
  unstable_GridRow as GridRow,
  unstable_useGridState as useGridState,
} from 'reakit/Grid';
const StyledRow = styled(GridRow)`

`;

export function ScreenRow ({
  className,

  ...props
}) {
  const grid = useGridState();

  return (
    <StyledRow
      {...grid} className={clsx(
        'row',
        className
      )}
    >
      {props.children}
    </StyledRow>
  );
}

if (module.hot?.accept) module.hot.accept();
