import { Action } from 'routing-controllers'
import { verify } from 'jsonwebtoken'
import { parse } from 'querystring'
import { UserService } from '../services'
import { Container } from 'typedi'
import { Configs } from '../constants'
import { User } from '../entities'

export const CurrentUserChecker = async (action: Action) => {
  const userService = Container.get(UserService)
  const cookie = action.request.ctx.header.cookie
  const token = parse(cookie).token as string
  if (!token) return false
  try {
    const jwtUser: User = verify(token, Configs.JWT_KEY) as User
    return await userService.findOneByName(jwtUser.username)
  } catch (e) {
    console.log(e)
    return false
  }
}
