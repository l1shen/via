import { Action } from 'routing-controllers'
import { parse } from 'querystring'
import { verify } from 'jsonwebtoken'
import { Configs } from 'configs/customs'

export const AuthorizationChecker = async (action: Action): Promise<boolean> => {
  const cookie = action.request.header.cookie
  const token = parse(cookie).token as string
  if (!token) return false
  try {
    const _user = await verify(token, Configs.JWT_KEY)
    action.context._user = _user
    return !!_user
  } catch (e) {
    console.log(e)
    return false
  }
}
