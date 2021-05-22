'use strict';

import logger from './logger.mjs';
import responseTime from './responseTime.mjs';


export default app => {
  app.use(logger);
  app.use(responseTime);
}
