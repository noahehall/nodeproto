// @flow

import { logIt, throwIt } from '@nodeproto/shared';
import { StrictMode } from 'react';

import ReactDOM from 'react-dom';

import { App } from './components/screens/App/AppScreen.mjs';
import { ErrorBoundary } from './components/composite/Errors/ErrorBoundary.mjs';

const containerID: string = 'root';
const container: HTMLElement | null = document.getElementById('root');

const render = (Comp): void => {
  logIt('rendering app');

  if (!container) throwIt('container is null');

  const root = ReactDOM.createRoot(container);

  root.render(
    <StrictMode>
      <ErrorBoundary>
        <Comp />
      </ErrorBoundary>
    </StrictMode>
  );
};

render(App);

if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    // if errors are bubbling up to window
    // you're doing something wrong
    console.error('\n\n unahndled exception occured', e);
  });
}
// should be disabled here as each screen (perhaps even deeper)
// should handle HMR for their component hierarchies
// $FlowIssue[prop-missing]
if (module.hot.accept) module.hot.accept(); // eslint-disable-line no-undef
