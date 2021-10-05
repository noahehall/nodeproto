// @flow
// @flow strict
/*
 * Landing Screen
 *
 * This is the first thing players see of our App, at the '/' route
 */

import { Anchor } from '../../composite/Clickable/Thing.mjs';
import { Helmet } from 'react-helmet';
import ScreenColumn from '../../composite/Grid/Column.mjs';
import ScreenGrid from '../../composite/Grid/Grid.mjs';
import { ScreenRow } from '../../composite/Grid/Row.mjs';
import * as React from 'react';

export default function LandingScreen (props: {}): React.Node {
  return (
    <ScreenGrid {...props} isFor='Landing'>
      <Helmet>
        <title>NIRV</title>

        <meta
          content='@nodeproto: build prototypes, fast!'
          name='description'
        />
      </Helmet>

      <ScreenRow>
        <ScreenColumn>
          <h1 className='animate__animated animate__backInUp'>@nodeproto: build prototypes, faster.</h1>
        </ScreenColumn>
      </ScreenRow>

      <ScreenRow>
        <ScreenColumn>
          <Anchor href='/v1' text='view our package check API' />
        </ScreenColumn>
      </ScreenRow>
    </ScreenGrid>
  );
}
