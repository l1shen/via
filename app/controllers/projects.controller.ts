import {
  Body, Get, JsonController, Post, QueryParam, UseInterceptor,
  BodyParam, Req, Authorized, Param, CurrentUser, Action, BadRequestError, NotFoundError,
} from 'routing-controllers'
import to from 'await-to-js'
import { ProjectService, UserService } from '../services'
import { Project, User } from '../entities'
import { Tips } from '../constants'
import { isEmpty, pick } from '../helpers'
import { ProjectsType, ProjectType } from '../types'

@Authorized()
@JsonController('/projects')
export class ProjectsController {
  constructor(
    private projectService: ProjectService,
    private userService: UserService,
  ) {}

  @Get('/')
  async index(): Promise<ProjectsType> {
    const projects = await this.projectService.list()
    return { projects }
  }

  @Get('/:name')
  async show(@Param('name') name: string): Promise<ProjectType> {
    const project = await this.projectService.findOneByName(name)
    if (isEmpty(project)) throw new NotFoundError(Tips.PROJECT_NOT_FOUND)
    if (isEmpty(project.users)) return { project }
    const users = await this.userService.findListByIds(project.users)
    const projectWithUsers = Object.assign({}, project, { users })
    return { project: projectWithUsers }
  }

  @Post('/')
  async create(
    @Body() body: Project,
    @CurrentUser({ required: true }) user: User,
  ): Promise<ProjectType> {
    const project = pick(body, ['name', 'description', 'url_base'])
    project['users'] = [user.id]
    const [createErr, created] = await to(this.projectService.create(project))
    if (createErr) throw new BadRequestError(Tips.PROJECT_CREATED_ERROR)
    return { project: created }
  }
}
