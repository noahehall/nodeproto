'use strict'

/* eslint-disable comma-dangle */

import React from 'react'
import {
  unstable_GridCell as GridCell,
  unstable_useGridState as useGridState,
} from 'reakit/Grid'
import styled from 'styled-components'

const StyledCell = styled(GridCell)`

`

export function ScreenColumn ({
  className = 'screen-column',

  ...props
}) {
  const grid = useGridState();

  return (
    <StyledCell {...grid} className={`column ${className}`}>
      {props.children}
    </StyledCell>
  )
}
