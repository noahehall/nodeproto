// @flow

import { cloneElement, Component } from 'react';
import JsonPretty from 'react-json-pretty';
import JSONPrettyMonTheme from 'react-json-pretty/dist/monikai';

import { DisplayError } from './DisplayError.mjs';

import type { Element, Portal } from '../../../libdefs';

type ErrorBoundaryProps = {
  children: Element<any>
};

type ErrorBoundaryState = {
  error: ?Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor (props: ErrorBoundaryProps) {
    super(props);

    this.state = { error: null };
  }

  static getDerivedStateFromError (error: Error): { error: Error } {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch (error: Error, info: { componentStack: string, ...}) {
    console.error(info);
  }

render(): Element < typeof DisplayError > | Portal {
    return (
      this.state.error
        ? <DisplayError error={this.state.error} />
        : cloneElement(this.props.children, this.props)
    );
  }
}

// if (module.hot.accept) module.hot.accept(); // eslint-disable-line no-undef
