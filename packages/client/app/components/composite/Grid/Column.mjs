'use strict'

import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import {
  unstable_GridCell as GridCell,
  unstable_useGridState as useGridState,
} from 'reakit/Grid'

const StyledCell = styled(GridCell)`

`

export function ScreenColumn ({
  className,

  ...props
}) {
  const grid = useGridState()

  return (
    <StyledCell {...grid} className={clsx('column', className)} >
      {props.children}
    </StyledCell>
  )
}

if (module?.hot?.accept) module.hot.accept()
