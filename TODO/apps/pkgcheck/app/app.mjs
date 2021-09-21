
import initMiddleware from './api/middleware/initMiddleware.mjs';
import createApp from './appCreate.mjs';
import initAppRouter from './appRouter.mjs';

export const App = initAppRouter(initMiddleware(createApp()));
export default App;
