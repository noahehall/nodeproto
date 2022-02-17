// @flow

// copypasta
// ^ @see https://github.com/mdn/webextensions-examples/blob/master/menu-demo/background.js

import browserPolyfill from 'webextension-polyfill';

import { errorHandler, translate } from '../shared/utils';

import type { BrowserType } from '../libdefs';

const browser: BrowserType = browserPolyfill;

browser.menus.create(
  {
    command: '_execute_sidebar_action',
    contexts: ['all'],
    id: 'open-sidebar',
    title: translate('menuItemOpenSidebar'),
  },
  errorHandler
);
