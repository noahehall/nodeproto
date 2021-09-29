// @flow

/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { ScreenGrid } from '../../composite/Grid/Grid.mjs';

export default function NotFound () {
  return (
    <ScreenGrid isFor='Not Found'>
      <h1>
        wtf happened bro?
      </h1>
    </ScreenGrid>
  );
}
