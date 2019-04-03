import Koa from 'koa'
import kcors from '@koa/cors'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import { Environment } from './environments'


export const useMiddlewares = <T extends Koa>(app: T): T => {
  // cors options: https://github.com/koajs/cors#corsoptions
  app.use(kcors())
  
  Environment.identity !== 'test' && app.use(logger())
  
  app.use(bodyParser())
  
  return app
}
