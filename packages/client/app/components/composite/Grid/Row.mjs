'use strict'

/* eslint-disable comma-dangle */

import React from 'react'
import {
  unstable_GridRow as GridRow,
  unstable_useGridState as useGridState,
} from 'reakit/Grid'
import styled from 'styled-components'

const StyledRow = styled(GridRow)`

`

export function ScreenRow ({
  className = 'screen-row',

  ...props
}) {
  const grid = useGridState();

  return (
    <StyledRow {...grid} className={`row ${className}`}>
      {props.children}
    </StyledRow>
  )
}
