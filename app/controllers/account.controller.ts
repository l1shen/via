import {
  JsonController, Post, BodyParam, UnauthorizedError, Req, BadRequestError,
} from 'routing-controllers'
import to from 'await-to-js'
import { Request } from 'koa'
import { User } from 'entities'
import { sign } from 'jsonwebtoken'
import { Tips } from 'app/constants'
import { authConfigs } from  'configs/customs'
import { AccountService, UserService } from 'services'

type UserResponse = { user: User }
const signComposer = async (payload: string | Buffer | object): Promise<string> => await sign(
  payload,
  authConfigs.keyOfJWT,
  { expiresIn: authConfigs.expiresIn },
)

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
  ): Promise<string> {
    const result = await this.accountService.signIn(username, password)
    if (!result) throw new BadRequestError(Tips.USER_NOT_FOUND)
    
    try {
      const token = await signComposer({ username: result.username, user_id: result.id })
      request.ctx.cookies.set('token', token, { httpOnly: authConfigs.httpOnly })
    } catch (e) {
      throw new UnauthorizedError(`${e}`)
    }
    return 'ok'
  }

  @Post('/sign_up')
  async signUp(
    @BodyParam('username') username: string,
    @BodyParam('password') password: string,
  ): Promise<UserResponse> {
    const user = await this.userService.findOneByName(username)
    if (user) throw new BadRequestError(Tips.USER_NAME_DUPLICATE)
    
    const [err, created] = await to(this.accountService.signUp(username, password))
    if (err) throw new BadRequestError(Tips.USER_CREATED_ERR)
    
    return { user: created }
  }
}
