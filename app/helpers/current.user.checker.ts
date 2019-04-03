import { Action } from 'routing-controllers'
import { verify } from 'jsonwebtoken'
import { parse } from 'querystring'
import { UserService } from '../services'
import { Container } from 'typedi'
import { Configs } from '../../configs/customs'
import { User } from '../entities'

export const CurrentUserChecker = async (action: Action) => {
  const userService = Container.get(UserService)
  const currentUser = action.context.currentUser
  if (!currentUser) return false
  try {
    return await userService.findOneByName(currentUser.username)
  } catch (e) {
    console.log(e)
    return false
  }
}
