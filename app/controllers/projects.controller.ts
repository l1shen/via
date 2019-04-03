import {
  Body, Get, JsonController, Post, QueryParam, UseInterceptor,
  BodyParam, Req, Authorized, Param, HttpError, CurrentUser, Action,
} from 'routing-controllers'
import {ProjectService, UserService} from '../services'
import { Project, User } from '../entities'
import { Tips } from '../constants'
import { isEmpty, pick } from '../helpers'

@Authorized()
@JsonController('/projects')
export class ProjectsController {
  constructor(
    private projectService: ProjectService,
    private userService: UserService,
  ) {}

  @Get('/')
  @UseInterceptor(async (action: Action, content: any) => {
    try {
      console.log(action)
      return content
    } catch (e) {
      console.log(e)
    }
  })
  async index(): Promise<any> {
    const projects = await this.projectService.list()
    return { projects }
  }

  @Get('/:name')
  async show(@Param('name') name: string): Promise<any> {
    const project = await this.projectService.findOneByName(name)
    if (isEmpty(project)) return Tips.PROJECT_NOT_FOUND
    if (isEmpty(project.users)) return { project }
    const users = await this.userService.findListByIds(project.users)
    const projectWithUsers = Object.assign({}, project, { users })
    return { project: projectWithUsers }
  }

  @Post('/')
  async create(@Body() body: Project, @CurrentUser({ required: true }) user: User): Promise<any> {
    try {
      const project = pick(body, ['name', 'description', 'url_base'])
      project['users'] = [user.id]
      const created = await this.projectService.create(project)
      return { project: created }
    } catch (e) {
      console.log(e)
      throw new HttpError(400, Tips.PROJECT_CREATED_ERROR)
    }
  }

}
