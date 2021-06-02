'use strict';
/**
  todo:(noah)
    clean this shit up
 */


// import '!file-loader?name=[name].[ext]!./images/favicon.ico';
// TODO
// maybe enable in prod?
// import 'nirvClient/workers';
import App from './components/screens/App';
import ErrorBoundary from './components/ErrorBoundary';
import React from 'react';
import ReactDOM from 'react-dom';

const render = (Comp) => {
  ReactDOM.render(
    // <React.StrictMode>
    <ErrorBoundary>
      <Comp />
    </ErrorBoundary>,
    // </React.StrictMode>,
    document.getElementById('app'),
  );
};

console.log('rendering app');
render(App);
if (module.hot) module.hot.accept('./components/screens/App', () => {
  render(require('./components/screens/App').default)
})
