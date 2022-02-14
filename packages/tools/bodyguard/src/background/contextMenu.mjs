// @flow

// copypasta
// ^ @see https://github.com/mdn/webextensions-examples/blob/master/menu-demo/background.js

import { errorHandler, translate } from '../shared/utils';

function onRemoved() {
  console.log('Item removed successfully');
}
function onError(error) {
  console.log(`Error: ${error}`);
}

browser.menus.create(
  {
    id: 'open-sidebar',
    title: translate('menuItemOpenSidebar'),
    contexts: ['all'],
    command: '_execute_sidebar_action',
  },
  errorHandler
);
