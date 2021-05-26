'use strict';
import App from './app/app.mjs';


const app = App();


export const runApp = () => app.listen(
  process.env.APP_PORT,
  console.log(`app started: ${process.env.APP_PORT}`)
);


if (import.meta.url) runApp();



