// @flow strict

import * as React from 'react';
import ScreenGrid from '../../composite/Grid/Grid.mjs';


export default function NotFound(arg: { default?: boolean }): React.Node {
  return (
    <ScreenGrid isFor='Not Found'>
      <h1>
        wtf happened bro?
      </h1>
    </ScreenGrid>
  );
}
