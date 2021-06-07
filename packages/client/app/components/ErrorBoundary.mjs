'use strict';


import React from 'react';
import JsonPretty from 'react-json-pretty';
import JSONPrettyMonTheme from 'react-json-pretty/dist/monikai';
import { DisplayError } from './composite/Errors/DisplayError.mjs';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch (error, errorInfo) {
    console.error(errorInfo)
  }

  render() {
    return (
      this.state.error
        ? <DisplayError error={this.state.error} />
        : React.cloneElement(this.props.children, this.props)
    )
  }
}
