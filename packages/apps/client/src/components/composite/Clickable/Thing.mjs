// @flow

import { Clickable } from 'reakit/Clickable';
import { useButton } from 'react-aria';

import * as React from 'react';
import clsx from 'clsx';
import styled from 'styled-components';


const StyledAnchor = styled(Clickable)`

`;

type ButtonProps = {
  children: React.Node
}

export function Button (props: ButtonProps): React.Element<'button'> {
  const ref: React.Ref<'button'> = React.useRef();

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

type AnchorProps = {
  className?: string,
  text?: string,
  ...
}

export function Anchor ({ className, text = 'Click Here', ...props }: AnchorProps): React.Node {
  return (
    <StyledAnchor {...props} className={clsx(className)} forwardedAs='a'>
      {text}

      <button>{"testing rect-aria"}</button>
    </StyledAnchor>
  );
}

if (module.hot.accept) module.hot.accept(); // eslint-disable-line no-undef
