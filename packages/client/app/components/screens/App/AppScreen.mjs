'use strict'

/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { Helmet } from 'react-helmet'
import { Router } from '@reach/router'
import GlobalStyle from './global-styles'
import LandingScreen from '../Landing/LandingScreen.mjs'
import NotFoundScreen from '../NotFound/NotFoundScreen.mjs'
import React from 'react'
import styled from 'styled-components'

// css
import 'normalize.css'
import 'milligram'
import 'animate.css'

const OuterContainer = styled.div`
  display: flex;
  flex-flow: wrap column;
  height: 100%;
  margin: 0 auto;
  overflow: visible;
  padding: 0;
`

const InnerContainer = styled.div`
  overflow: visible;
  position: relative;
`

const AppWrapper = styled.main`
  height: 100%;
  overflow: visible;
  padding: 10px;
`

export const App = () => (
  <OuterContainer id='outer-container'>
    <Helmet
      titleTemplate='%s - NIRV'
      defaultTitle='NIRV'
    >
      <meta name='description' content='IT TAKES NIRV' />
    </Helmet>
    <InnerContainer id='inner-container'>
      <AppWrapper id='app-wrapper'>
        <Router>
          <LandingScreen path='/' isFor='ppop' />
          <NotFoundScreen default />
        </Router>
      </AppWrapper>
    </InnerContainer>
    <GlobalStyle />
  </OuterContainer>
)

export default App

