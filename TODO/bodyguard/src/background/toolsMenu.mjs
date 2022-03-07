// @flow

import browserPolyfill from 'webextension-polyfill';

import { errorHandler, translate } from '../shared/utils';

import type { BrowserType } from '../libdefs';

const browser: BrowserType = browserPolyfill;

browser.menus.create(
  {
    contexts: ['tools_menu'],
    id: 'tools-menu',
    title: translate('menuItemToolsMenu'),
  },
  errorHandler
);
