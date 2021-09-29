// @flow

import { Helmet } from 'react-helmet';
import { Router } from '@reach/router';
import GlobalStyle from './global-styles.mjs';
import LandingScreen from '../Landing/LandingScreen.mjs';
import NotFoundScreen from '../NotFound/NotFoundScreen.mjs';
import React from 'react';
import styled from 'styled-components';

// css
import 'normalize.css';
import 'milligram';
import 'animate.css';

const OuterContainer = styled.div`
  display: flex;
  flex-flow: wrap column;
  height: 100%;
  margin: 0 auto;
  overflow: visible;
  padding: 0;
`;

const InnerContainer = styled.div`
  overflow: visible;
  position: relative;
`;

const AppWrapper = styled.main`
  height: 100%;
  overflow: visible;
  padding: 10px;
`;

export function App () {
  return (<OuterContainer id='outer-container'>
    <Helmet
      defaultTitle='NIRV'
      titleTemplate='%s - NIRV'
    >
      <meta content='IT TAKES NIRV' name='description' />
    </Helmet>

    <InnerContainer id='inner-container'>
      <AppWrapper id='app-wrapper'>
        <Router>
          <LandingScreen isFor='ppop' path='/' />

          <NotFoundScreen default />
        </Router>
      </AppWrapper>
    </InnerContainer>

    <GlobalStyle />
  </OuterContainer>);
}

export default App;
