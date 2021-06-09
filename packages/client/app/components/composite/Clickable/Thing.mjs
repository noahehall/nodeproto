'use strict'

import { Clickable } from 'reakit/Clickable'
import { useButton } from 'react-aria';
import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'

console.log('\n\n useButton', useButton)
const StyledAnchor = styled(Clickable)`

`


export const Button = (props) => {
  const ref = React.useRef();
  const {buttonProps} = useButton(props, ref);

  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
}

export const Anchor = ({
  className,
  text = 'link text',

  ...props
}) => {
  return (
    <StyledAnchor {...props} className={clsx(className)} forwardedAs='a'>
      {text}
      <button>testing rect-aria</button>
    </StyledAnchor>
  )
}

if (module?.hot?.accept) module.hot.accept()
