import {
  Body, Get, JsonController, Post, QueryParam, UseInterceptor,
  BodyParam, UnauthorizedError, Req, BadRequestError,
} from 'routing-controllers'
import { Request } from 'koa'
import { sign } from 'jsonwebtoken'
import { AccountService, UserService } from '../services'
import { User } from '../entities'
import { Tips } from '../constants'
import { Configs } from  '../../configs/customs'



@JsonController('/account')
export class AccountController {
  
  constructor(
    private accountService: AccountService,
    private userService: UserService,
  ) {
  }

  @Post('/sign_in')
  async signIn(
    @BodyParam('username', { required: true }) username: string,
    @BodyParam('password', { required: true }) password: string,
    @Req() request: Request,
  ): Promise<any> {
    const result = await this.accountService.signIn(username, password)
    if (!result) throw new BadRequestError(Tips.USER_NOT_FOUND)
    try {
      const token = await sign(
        { username: result.username, user_id: result.id },
        Configs.JWT_KEY,
        { expiresIn: Configs.EXPIRES_IN },
      )
      request.ctx.cookies.set('token', token, { httpOnly: true })
      return 'ok'
    } catch (e) {
      console.log(e)
      throw new UnauthorizedError()
    }
  }

  @Post('/sign_up')
  async signUp(
    @BodyParam('username') userName: string,
    @BodyParam('password') password: string,
  ): Promise<any> {
    const user = await this.userService.findOneByName(userName)
    if (user) throw new BadRequestError(Tips.USER_NAME_DUPLICATE)
    try {
      const created = await this.accountService.signUp(userName, password)
      return { user: created }
    } catch {
     throw new UnauthorizedError()
    }
  }
}
