'use strict';

/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */


import { Helmet } from 'react-helmet';
import { Router, Link } from '@reach/router';
import GlobalStyle from './global-styles';
import LandingScreen from '../Landing/index.mjs';
import NotFoundScreen from '../NotFound/index.mjs';
import React from 'react';
import styled from 'styled-components';


const OuterContainer = styled.div`

`;

const Main = styled.main`

`


export const App = () => (
  <OuterContainer id='outer-container'>
    <Helmet
      titleTemplate='%s - NIRV'
      defaultTitle='NIRV'
    >
      <meta name='description' content='IT TAKES NIRV' />
    </Helmet>
          <div id='inner-container' style={{position: 'relative'}}>
            <Main id='app-wrapper'>
              <Router>
                <LandingScreen path='/' />
                <NotFoundScreen default />
              </Router>
            </Main>
          </div>
    <GlobalStyle />
  </OuterContainer>
);

export default App;
