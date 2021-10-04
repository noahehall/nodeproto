// @flow

import App from './components/screens/App/AppScreen.mjs';
import ErrorBoundary from './components/composite/Errors/ErrorBoundary.mjs';
import * as React from 'react';
import ReactDOM from 'react-dom';

const containerID: string = 'root';
const container = document.getElementById('root');

const render = (Comp) => {
  console.info('rendering app'); // TODO: need to add logging logic

  // $FlowFixMe[prop-missing] its using annotations from react@17
  const root = ReactDOM.createRoot(container);

  root.render(
    // <React.StrictMode>
    <ErrorBoundary>
      <Comp />
    </ErrorBoundary>
    // </React.StrictMode>
  );
};

render(App);

if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    e => {
    // if errors are bubbling up to window
    // you're doing something wrong
      console.error(
        '\n\n unahndled exception occured',
        e
      );
    }
  );
}
// should be disabled here as each screen (perhaps even deeper)
// should handle HMR for their component hierarchies
if (module.hot.accept) module.hot.accept();
