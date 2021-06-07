'use strict'

/* eslint-disable comma-dangle */


import App from './components/screens/App/AppScreen.mjs'
import ErrorBoundary from './components/ErrorBoundary'
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
module.hot.accept()
// if (module.hot) module.hot.accept('./components/screens/App', () => {
//   render(require('./components/screens/App').default)
// })
