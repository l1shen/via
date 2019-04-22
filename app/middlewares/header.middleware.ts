import { KoaMiddlewareInterface, Middleware } from 'routing-controllers'

@Middleware({ type: 'before' })
export class CustomErrorHandler implements KoaMiddlewareInterface {
  async use(context: any, next: (err?: any) => any): Promise<any> {
    context.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH')
    context.set('Access-Control-Allow-Origin', context.request.header.origin)
    context.set('Access-Control-Allow-Headers', ['content-type'])
    context.set('Access-Control-Max-Age', '20')
    context.set('Access-Control-Allow-Credentials', 'true')
    return next()
  }
}
