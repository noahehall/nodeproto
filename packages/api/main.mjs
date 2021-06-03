'use strict';
import App from './app/app.mjs';

export const runApp = async () => (await App()).listen(
  process.env.API_PORT,
  console.log(`app started: ${process.env.API_PORT}`)
);

// assumption: running without transpiling to cjs
// todo: module.main thing for mjs
if (import.meta.url) runApp();



