// @flow strict

import * as React from 'react';
import JsonPretty from 'react-json-pretty';
import JSONPrettyMonTheme from 'react-json-pretty/dist/monikai';

type DisplayErrorProps = {
  error: Error,
  info?: { componentStack: string, ...}
}

export default function DisplayError ({
  error,
  info = {},
}: DisplayErrorProps): React.Node {
  return (<section>
    <h1>{"Something went wrong."}</h1>

    <h2>{"Error"}</h2>

    <JsonPretty data={error} theme={JSONPrettyMonTheme} />

    <h2>{"Error Info"}</h2>

    <JsonPretty data={info} theme={JSONPrettyMonTheme} />
  </section>);
}

if (module.hot.accept) module.hot.accept(); // eslint-disable-line no-undef
