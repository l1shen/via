import {
  Body, Get, JsonController, Post,
  Authorized, Param, CurrentUser, BadRequestError, NotFoundError,
} from 'routing-controllers'
import to from 'await-to-js'
import { Tips } from 'app/constants'
import { isEmpty, pick } from 'app/helpers'
import { Project, User } from 'entities'
import { ProjectService, UserService } from 'services'

type ProjectsResponse = { projects: Array<Project> }
type ProjectResponse = { project: Project }

@Authorized()
@JsonController('/projects')
export class ProjectsController {
  constructor(
    private projectService: ProjectService,
    private userService: UserService,
  ) {}

  @Get('/')
  async index(): Promise<ProjectsResponse> {
    const projects = await this.projectService.list()
    return { projects }
  }

  @Get('/:name')
  async show(@Param('name') name: string): Promise<ProjectResponse> {
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
  ): Promise<ProjectResponse> {
    const project = pick(body, ['name', 'description', 'url_base'])
    const projectWithUsers = Object.assign({}, project, { users: [user.id] })
    const [createErr, created] = await to(this.projectService.create(projectWithUsers))
    if (createErr) throw new BadRequestError(Tips.PROJECT_CREATED_ERROR)
    return { project: created }
  }
}
