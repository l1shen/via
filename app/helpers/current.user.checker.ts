import { Container } from 'typedi'
import { UserService } from 'services'
import { Action } from 'routing-controllers'
import { User } from 'entities'

export const CurrentUserChecker = async (action: Action): Promise<User | null> => {
  const userService = Container.get(UserService)
  const _user = action.context._user
  if (!_user) return null
  try {
    return await userService.findOneByName(_user.username)
  } catch (e) {
    console.log(e)
    return null
  }
}
