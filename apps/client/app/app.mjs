
/* eslint-disable comma-dangle */

import App from './components/screens/App/AppScreen.mjs'
import ErrorBoundary from './components/composite/Errors/ErrorBoundary.mjs'
import React from 'react'
import ReactDOM from 'react-dom'

const render = (Comp) => {
  ReactDOM.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Comp />
      </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById(process.env.REACT_APP_ID),
  )
}

console.log('rendering app')
render(App)

if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    () => {
    // if errors are bubbling up to window
    // you're doing something wrong
      console.error(
        '\n\n unahndled exception occured',
        e
      )
    }
  )
}
// should be disabled here as each screen (perhaps even deeper)
// should handle HMR for their component hierarchies
if (module?.hot?.accept) module.hot.accept()
// if (module.hot) module.hot.accept('./components/screens/App', () => {
//   render(require('./components/screens/App').default)
// })
