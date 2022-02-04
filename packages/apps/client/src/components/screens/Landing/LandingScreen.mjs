// @flow

import { Helmet } from 'react-helmet';

import { Anchor } from '../../composite/Clickable/Thing.mjs';
import { ScreenColumn } from '../../composite/Grid/Column.mjs';
import { ScreenGrid } from '../../composite/Grid/Grid.mjs';
import { ScreenRow } from '../../composite/Grid/Row.mjs';

import type { ComponentType, Element } from '../../../../libdefs';

export const LandingScreen: ComponentType<any> = (props: {}): Element<typeof ScreenGrid> => {
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
};
