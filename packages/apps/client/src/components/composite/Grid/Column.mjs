// @flow

import { unstable_GridCell as GridCell, unstable_useGridState as useGridState } from 'reakit/Grid';
import * as React from 'react';
import clsx from 'clsx';
import styled from 'styled-components';

const StyledCell = styled(GridCell)`

`;

type ScreenColumnProps = {
  className: string,
  children: React.Node,
};

export default function ScreenColumn ({ className, children }: ScreenColumnProps): React.Node {
  const grid: {} = useGridState();

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

if (module.hot?.accept) module.hot.accept(); // eslint-disable-line no-undef
