// @flow

import { Clickable } from 'reakit/Clickable';
import { useButton } from 'react-aria';
import { useRef } from 'react';

import clsx from 'clsx';
import styled from '@emotion/styled';

import type { ComponentType, Element, Node, Ref } from '../../libdefs';

const StyledAnchor = styled(Clickable)`

`;

type ButtonProps = {
  children?: Node,
};

export const Button: ComponentType<ButtonProps> = (props) => {
  const ref: Ref<'button'> = useRef();

  const { buttonProps } = useButton(props, ref);

  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
};

type AnchorProps = {
  className?: string,
  text?: string,
  ...
};

export const Anchor: ComponentType<AnchorProps> = ({
  className,
  text = 'Click Here',
  ...props
} = {}): Element<typeof StyledAnchor> => {
  return (
    <StyledAnchor {...props} className={clsx(className)} forwardedAs="a">
      {text}

      <button>{'testing rect-aria'}</button>
    </StyledAnchor>
  );
};

// if (module.hot.accept) module.hot.accept(); // eslint-disable-line no-undef
