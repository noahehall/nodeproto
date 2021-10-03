// @flow

import * as React from 'react';
import JsonPretty from 'react-json-pretty';
import JSONPrettyMonTheme from 'react-json-pretty/dist/monikai';
import DisplayError from './DisplayError.mjs';

// i wonder if this has something to do with our babel plugins/react setup
const { Component, cloneElement } = React.default;

export type ErrorBoundaryProps = {
  children: React.Element<any>
};

export type ErrorBoundaryState = {
  error: Error
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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

  render(): React.Element<any> {
    return (
      this.state.error
        ? <DisplayError error={this.state.error} />
        : cloneElement(this.props.children, this.props)
    );
  }
}

if (module.hot.accept) module.hot.accept();
