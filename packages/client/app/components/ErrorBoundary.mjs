'use strict';


import React from 'react';
import JsonPretty from 'react-json-pretty';
import JSONPrettyMonTheme from 'react-json-pretty/dist/monikai';
// import Flatted from 'flatted';

const logErrorToMyService = console.error;

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: {}, errorInfo: {} };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <section>
          <h1>Something went wrong.</h1>
          <h2>Error</h2>
          <JsonPretty data={this.state.error} theme={JSONPrettyMonTheme} />
          <h2>Error Info</h2>
          <JsonPretty style={{height: '100vh'}} data={this.state.errorInfo} theme={JSONPrettyMonTheme} />
        </section>
      );
    }

    return this.props.children;
  }
}
