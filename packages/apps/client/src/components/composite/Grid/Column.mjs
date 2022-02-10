// @flow

import {
  unstable_GridCell as GridCell,
  unstable_useGridState as useGridState
} from 'reakit/Grid';

import clsx from 'clsx';
import styled from '@emotion/styled';

import type { ComponentType, Element, Node } from '../../../../libdefs.mjs';

const StyledCell = styled(GridCell)`

`;

type ScreenColumnProps = {
  className?: string,
  children: Element<any>,
};

export const ScreenColumn: ComponentType<ScreenColumnProps> = ({
  className,
  children } = {}
): Element<typeof StyledCell> => {
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
};

// if (module.hot?.accept) module.hot.accept(); // eslint-disable-line no-undef
