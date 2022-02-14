// @flow

import { errorHandler, translate } from '../shared/utils';

browser.menus.create(
  {
    id: 'tools-menu',
    title: translate('menuItemToolsMenu'),
    contexts: ['tools_menu'],
  },
  errorHandler
);
