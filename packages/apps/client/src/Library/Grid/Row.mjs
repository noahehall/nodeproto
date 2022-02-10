// @flow

import {
  unstable_GridRow as GridRow,
  unstable_useGridState as useGridState,
} from 'reakit/Grid';

import clsx from 'clsx';
import styled from '@emotion/styled';

import type { ComponentType, Element } from '../../../libdefs';

const StyledRow = styled(GridRow)`

`;

export type ScreenRowProps = {
  className?: string,
  children: Element<any>,
  ...
}

export const ScreenRow: ComponentType<ScreenRowProps> = ({
  className,
  children,
  ...props
} = {}): Element<typeof StyledRow> => {
  const grid = useGridState();

  return (
    <StyledRow
      {...grid}
      className={clsx('row', className)}
    >
      {children}
    </StyledRow>
  );
};

// if (module.hot?.accept) module.hot.accept();
