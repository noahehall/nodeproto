// @flow

import type { ComponentType, ElementType } from '../../../libdefs';

type DisplayErrorProps = {
  error: Error,
  info?: { componentStack: string, ...}
}

export const DisplayError: ComponentType<DisplayErrorProps> = ({
  error,
  info = {},
} = {}) => {
  return (
    <section>
      <h1>{"Something went wrong."}</h1>
      <h2>{"Error"}</h2>
      <div>{JSON.stringify(error)}</div>
      <h2>{"Error Info"}</h2>
      <div>{JSON.stringify(info)}</div>
    </section>
  );
};

// if (module.hot.accept) module.hot.accept(); // eslint-disable-line no-undef
