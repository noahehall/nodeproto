// @flow

import { Clickable } from 'reakit/Clickable';
import { useButton } from 'react-aria';
import clsx from 'clsx';
import * as React from 'react';
import styled from 'styled-components';


const StyledAnchor: React.ComponentType<any> = styled(Clickable)`

`;

type ButtonProps = {
  children: React.Node
}

export function Button (props: ButtonProps): React.Element<'button'> {
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

type AnchorProps = {
  className: string,
  text?: string,
}

export function Anchor (arg: AnchorProps = {}): React.Node {
  const { className, text = 'Click Here', ...props } = arg;

  return (
    <StyledAnchor {...props} className={clsx(className)} forwardedAs='a'>
      {text}

      <button>testing rect-aria</button>
    </StyledAnchor>
  );
}

// $FlowIgnore[prop-missing]
if (module?.hot?.accept) module.hot.accept();
