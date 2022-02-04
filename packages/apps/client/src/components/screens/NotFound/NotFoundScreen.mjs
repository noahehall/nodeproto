// @flow

import { ScreenGrid } from '../../composite/Grid/Grid.mjs';

import type { ComponentType, Element } from '../../../../libdefs';

export const NotFoundScreen: ComponentType<void> = () => {
  return (
    <ScreenGrid isFor='Not Found'>
      <h1>
        {" wtf happened bro?"}
      </h1>
    </ScreenGrid>
  );
};
