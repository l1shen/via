import { Action } from 'routing-controllers'
import { parse } from 'querystring'
import { verify } from 'jsonwebtoken'
import { Configs } from '../constants'

export const AuthorizationChecker = async (action: Action) => {
  const cookie = action.request.header.cookie
  const token = parse(cookie).token
  if (!token) return false
  try {
    return !!(await verify(token, Configs.JWT_KEY))
  } catch (e) {
    console.log(e)
    return false
  }
}
