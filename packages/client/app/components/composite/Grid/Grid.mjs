'use strict'

/* eslint-disable comma-dangle */

import {
  unstable_useGridState as useGridState,
  unstable_Grid as Grid,
} from 'reakit/Grid'
import styled from 'styled-components'
import React from 'react'


const StyledGrid = styled(Grid)`
  /* display: flex;
  flex-flow: nowrap column; */
`

export function ScreenGrid ({
  isFor = 'Nirv',
  className = 'screen-grid',

  ...props
}) {
  const grid = useGridState()

  return (
    <StyledGrid {...grid} aria-label={`${isFor} grid`} className={`container ${className}`}>
      {props.children}
    </StyledGrid>
  )
}
