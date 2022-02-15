// @flow

import browserPolyfill from 'webextension-polyfill';

import { errorHandler, translate } from '../shared/utils';

import type { BrowserType } from '../libdefs';

const browser: BrowserType = browserPolyfill;

browser.menus.create(
  {
    id: 'tools-menu',
    title: translate('menuItemToolsMenu'),
    contexts: ['tools_menu'],
  },
  errorHandler
);
