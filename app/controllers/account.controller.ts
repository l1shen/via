import {
  Body, Get, JsonController, Post, QueryParam, UseInterceptor,
  BodyParam, UnauthorizedError, Req, BadRequestError,
} from 'routing-controllers'
import { Request } from 'koa'
import { sign } from 'jsonwebtoken'
import { AccountService, UserService } from '../services'
import { User } from '../entities'
import { Tips, Configs } from '../constants'



@JsonController('/account')
export class AccountController {
  
  constructor(
    private accountService: AccountService,
    private userService: UserService,
  ) {
  }

  @Post('/sign_in')
  async signIn(
    @BodyParam('user_name') userName: string,
    @BodyParam('password') password: string,
    @Req() request: Request,
  ): Promise<any> {
    try {
      const result = await this.accountService.signIn(userName, password)
      if (!result) return Tips.USER_NOT_FOUND
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
  async signUp(@BodyParam('user_name') userName: string, @BodyParam('password') password: string): Promise<any> {
    try {
      const user = await this.userService.findOneByName(userName)
      if (user) return Tips.USER_NAME_DUPLICATE
      const newUser = await this.accountService.signUp(userName, password)
      return { user: { userName: newUser.username} }
    } catch {
     throw new UnauthorizedError()
    }
  }

  // If your need to use database, please set useMongoDB(in configs/customs.ts) to true.
  // @Post('/sessions')
  // async create(@Body() session: Session): Promise<any> {
  //   const created = await this.sessionsService.create(session)
  //   return { created }
  // }
}
