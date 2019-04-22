import { RoutingControllersOptions } from 'routing-controllers'
import * as controllers from 'controllers'
import * as interceptors from './interceptors'
import { AuthorizationChecker, CurrentUserChecker } from 'app/helpers'
const objectToArray = (dict: object): Array<any> =>
  Object.keys(dict).map(name => dict[name])


export const routingConfigs: RoutingControllersOptions = {
  controllers: objectToArray(controllers),
  
  // global interceptors
  interceptors: objectToArray(interceptors),
  
  // router prefix
  // e.g. api => http://hostname:port/{routePrefix}/{controller.method}
  routePrefix: '/apis',
  
  // auto validate entity item
  // learn more: https://github.com/typestack/class-validator
  validation: true,

  authorizationChecker: AuthorizationChecker,
  currentUserChecker: CurrentUserChecker,
}

export const useMongoDB = true

export enum Configs {
  JWT_KEY = 'via-jwt-config-key',
  EXPIRES_IN = '7 days',
}

