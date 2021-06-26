// @flow
import { Clickable } from 'reakit/Clickable'
import { type, Element, declare } from '../../../../propTypes/index.mjs';
import { useButton } from 'react-aria';
import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';

const StyledAnchor = styled(Clickable)`

`

export type ButtonProps = {
  children: any
}

export function Button (props: ButtonProps): Element<'button'> {
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


export type AnchorProps = {
  className: string,
  text?: string,
}
export function Anchor (arg: AnchorProps = {}): Element<'anchor'> {
  const { className, text = 'Click Here', ...props } = arg;

  return (
    <StyledAnchor {...props} className={clsx(className)} forwardedAs='a'>
      {text}

      <button>testing rect-aria</button>
    </StyledAnchor>
  )
}

// $FlowIgnore[prop-missing]
if (module?.hot?.accept) module.hot.accept()
