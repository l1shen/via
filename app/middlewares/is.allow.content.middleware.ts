import { BadRequestError, KoaMiddlewareInterface } from 'routing-controllers'
import { Tips } from '../constants'

export class IsAllowContentMiddleware implements  KoaMiddlewareInterface {
  use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    try {
      JSON.parse(context.request.body.content)
    } catch (e) {
      return next(new BadRequestError(Tips.CONFIG_PARSE_ERROR))
    }
    return next()
  }
}
