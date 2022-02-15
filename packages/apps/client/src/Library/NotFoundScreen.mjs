// @flow

import { ScreenGrid } from './Grid/Grid.mjs';

import type { ComponentType } from '../libdefs';

export const NotFoundScreen: ComponentType<{ default?: boolean }> = () => {
  return (
    <ScreenGrid isFor="Not Found">
      <h1>{'wtf happened bro?'}</h1>
    </ScreenGrid>
  );
};
