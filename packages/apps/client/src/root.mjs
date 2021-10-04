// @flow strict

import App from './components/screens/App/AppScreen.mjs';
import ErrorBoundary from './components/composite/Errors/ErrorBoundary.mjs';
import ReactDOM from 'react-dom';

const containerID: string = 'root';
const container: HTMLElement | null = document.getElementById('root');

const render = (Comp) : void => {
  console.info('rendering app'); // TODO: need to add logging logic

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
// $FlowExpectedError
if (module.hot.accept) module.hot.accept(); // eslint-disable-line no-undef
