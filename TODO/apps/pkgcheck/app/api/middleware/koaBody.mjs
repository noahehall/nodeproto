
/**
 * for handling multipart form bodies
 */
import body from 'koa-body';
import bodyParser from 'koa-bodyparser';

// handles forms
export function koaBody (conf, app) {
  return body()
}

// doesnt handle forms
// required (temporarily) for koa-oas3
// default app body parser
export function koaBodyParser (conf = {}, app) {
  return bodyParser();
}
