'use strict'

/* eslint-disable comma-dangle */

import React from 'react'
import { Clickable } from 'reakit/Clickable'
import styled from 'styled-components'

const StyledAnchor = styled(Clickable)`

`

export const Anchor = ({
  className = 'anchor',
  text = 'link text',

  ...props
}) => {
  return (
    <StyledAnchor {...props} className={className} forwardedAs='a'>
      {text}
    </StyledAnchor>
  )
}
