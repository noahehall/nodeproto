'use strict';

import App from './app/app.mjs';
import { fsproto } from '@nodeproto/lib';


export const runApp = async () => (await App()).listen(
  process.env.API_PORT,
  console.log(`app started: ${process.env.API_PORT}`)
);


if (fsproto.isMain(typeof module !== 'undefined' && module, import.meta)) runApp();



