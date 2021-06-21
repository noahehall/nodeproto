
import { Clickable } from 'reakit/Clickable'
import { useButton } from 'react-aria';
import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'

const StyledAnchor = styled(Clickable)`

`

export function Button (props) {
  const ref = React.useRef();
  const { buttonProps } = useButton(
    props,
    ref
  );

  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
}

export function Anchor ({
  className,
  text = 'link text',

  ...props
}) {
  return (
    <StyledAnchor {...props} className={clsx(className)} forwardedAs='a'>
      {text}

      <button>testing rect-aria</button>
    </StyledAnchor>
  )
}

if (module?.hot?.accept) module.hot.accept()
