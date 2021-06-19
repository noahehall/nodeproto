
/* eslint-disable comma-dangle */

import clsx from 'clsx'
import ErrorBoundary from '../Errors/ErrorBoundary.mjs'
import React from 'react'
import styled from 'styled-components'
import {
  unstable_Grid as Grid,
  unstable_useGridState as useGridState,
} from 'reakit/Grid'

const StyledGrid = styled(Grid)`
  /* display: flex;
  flex-flow: nowrap column; */
`

export function ScreenGridNative ({
  isFor = 'Nirv',
  className,

  ...props
}) {
  const grid = useGridState()

  return (
    <StyledGrid
      {...grid} aria-label={`${isFor} grid`} className={clsx(
        'container',
        className
      )}
    >
      {props.children}
    </StyledGrid>
  )
}

export function ScreenGrid (props) {
  return <ErrorBoundary><ScreenGridNative {...props} /></ErrorBoundary>
}

if (module?.hot?.accept) module.hot.accept()
