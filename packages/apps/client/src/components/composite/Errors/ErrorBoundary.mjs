// @flow

import DisplayError from './DisplayError.mjs';
import JsonPretty from 'react-json-pretty';
import JSONPrettyMonTheme from 'react-json-pretty/dist/monikai';

import * as React from 'react';

type ErrorBoundaryProps = {
  children: Node
};

type ErrorBoundaryState = {
  error: Error
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor (props: ErrorBoundaryProps) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromError (error: {}): {} {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch (error: Error, info: { componentStack: string, ...}) {
    console.error(info);
  }

  render(): React.Node {
    return (
      this.state.error
        ? <DisplayError error={this.state.error} />
        : React.cloneElement(this.props.children, this.props)
    );
  }
}

if (module.hot.accept) module.hot.accept(); // eslint-disable-line no-undef
