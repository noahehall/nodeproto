// @flow

import { Global } from '@emotion/react';
import { Helmet } from 'react-helmet';
import { Router } from '@reach/router';
import styled from '@emotion/styled';

import { globalStyles } from './global-styles.mjs';
import { LandingScreen } from './LandingScreen.mjs';
import { NotFoundScreen } from '../Library/NotFoundScreen.mjs';

// css
import 'normalize.css';
import 'milligram';
import 'animate.css';

import type { ComponentType, Element } from '../../libdefs';

const OuterContainer: ComponentType<any> = styled.div`
  display: flex;
  flex-flow: wrap column;
  height: 100%;
  margin: 0 auto;
  overflow: visible;
  padding: 0;
`;

const InnerContainer: ComponentType<any> = styled.div`
  overflow: visible;
  position: relative;
`;

const AppWrapper: ComponentType<any> = styled.main`
  height: 100%;
  overflow: visible;
  padding: 10px;
`;

export const App: ComponentType<{}> = () => {
  return (
    <OuterContainer id="outer-container">
      <Helmet defaultTitle="NIRV" titleTemplate="%s - NIRV">
        <meta content="IT TAKES NIRV" name="description" />
      </Helmet>

      <Global styles={globalStyles} />

      <InnerContainer id="inner-container">
        <AppWrapper id="app-wrapper">
          <Router>
            <LandingScreen isFor="ppop" path="/" />

            <NotFoundScreen default />
          </Router>
        </AppWrapper>
      </InnerContainer>
    </OuterContainer>
  );
};
