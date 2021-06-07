'use strict'

import { Clickable } from 'reakit/Clickable'
import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
const StyledAnchor = styled(Clickable)`

`

export const Anchor = ({
  className,
  text = 'link text',

  ...props
}) => {
  return (
    <StyledAnchor {...props} className={clsx(className)} forwardedAs='a'>
      {text}
    </StyledAnchor>
  )
}
