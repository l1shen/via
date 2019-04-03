import { Action } from 'routing-controllers'
import { parse } from 'querystring'
import { verify } from 'jsonwebtoken'
import { Configs } from '../../configs/customs'

export const AuthorizationChecker = async (action: Action) => {
  const cookie = action.request.header.cookie
  const token = parse(cookie).token as string
  if (!token) return false
  try {
    const currentUser = await verify(token, Configs.JWT_KEY)
    action.context.currentUser = currentUser
    return !!currentUser
  } catch (e) {
    console.log(e)
    return false
  }
}
