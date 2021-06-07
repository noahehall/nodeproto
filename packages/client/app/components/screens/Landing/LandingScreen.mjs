'use strict'

/*
 * Landing Screen
 *
 * This is the first thing players see of our App, at the '/' route
 */

import { Helmet } from 'react-helmet'
import React from 'react'
import { ScreenGrid } from '../../composite/Grid/Grid.mjs'
import { ScreenRow } from '../../composite/Grid/Row.mjs'
import { ScreenColumn } from '../../composite/Grid/Column.mjs'
import { Anchor } from '../../composite/Clickable/Thing.mjs'


export default function LandingScreen (props) {
  return (
    <ScreenGrid {...props} isFor='Landing'>
      <Helmet>
        <title>NIRV</title>
        <meta
          name='description'
          content='NIRV - FUCK YOUR RULES'
        />
      </Helmet>
      <ScreenRow>
        <ScreenColumn>
          <h1 className='animate__animated animate__backInUp'>@nodeproto: build prototypes, fast.</h1>
        </ScreenColumn>
      </ScreenRow>
      <ScreenRow>
        <ScreenColumn>
          <Anchor href='/v1' text='view our package check API' />
        </ScreenColumn>
      </ScreenRow>
    </ScreenGrid>
  )
}

