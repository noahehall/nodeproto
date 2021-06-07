'use strict'

/* eslint-disable comma-dangle */

import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'
import {
  unstable_useGridState as useGridState,
  unstable_Grid as Grid,
} from 'reakit/Grid'


const StyledGrid = styled(Grid)`
  /* display: flex;
  flex-flow: nowrap column; */
`

export function ScreenGrid ({
  isFor = 'Nirv',
  className,

  ...props
}) {
  const grid = useGridState()

  return (
    <StyledGrid {...grid} aria-label={`${isFor} grid`} className={clsx('container', className)} >
      {props.children}
    </StyledGrid>
  )
}
