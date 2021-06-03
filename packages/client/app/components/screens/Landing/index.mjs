'use strict';

/*
 * Landing Screen
 *
 * This is the first thing players see of our App, at the '/' route
 */

import { Helmet } from 'react-helmet';
import React from 'react';
import styled from 'styled-components';
import { Link } from '@reach/router';


const Article = styled.article`
  display: flex;
  flex-flow: nowrap column;
`

export const LandingScreen = (props) => {
  return (
    <Article>
      <Helmet>
        <title>NIRV</title>
        <meta
          name="description"
          content="NIRV - FUCK YOUR RULES"
        />
      </Helmet>
      <div>@nodeproto: build prototypes, fast.</div>
    </Article>
  );
}

export default LandingScreen;
