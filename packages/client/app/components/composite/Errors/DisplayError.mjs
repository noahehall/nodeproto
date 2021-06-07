'use strict'

import React from 'react';
import JsonPretty from 'react-json-pretty';
import JSONPrettyMonTheme from 'react-json-pretty/dist/monikai';

export const DisplayError = ({
  error,
  errorInfo
}) => (
  <section>
    <h1>Something went wrong.</h1>
    <h2>Error</h2>
    <JsonPretty data={error} theme={JSONPrettyMonTheme} />
    <h2>Error Info</h2>
    <JsonPretty data={errorInfo} theme={JSONPrettyMonTheme} />
  </section>
)
