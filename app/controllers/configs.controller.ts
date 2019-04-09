import {
  Body, Get, JsonController, Post, QueryParam, UseInterceptor,
  BodyParam, Req, Authorized, Param, HttpError, CurrentUser, BadRequestError, UseBefore, Ctx,
} from 'routing-controllers'
import to from 'await-to-js'
import { ConfigService, HistoryService, ProjectService } from '../services'
import { Config, User, History } from '../entities'
import { pick } from '../helpers'
import { Tips } from '../constants'
import { IsAllowContentMiddleware, FindProjectMiddleware } from '../middlewares'
import { Context } from 'koa'


type ConfigResponse = { config: Config }
type ConfigsResponse = { configs: Array<Config> }
type HistoriesResponse = { histories: Array<History> }
type DeploymentResponse =  { history: History } & ConfigResponse

@Authorized()
@JsonController('/projects/:project_name/configs')
@UseBefore(FindProjectMiddleware)
export class ConfigsController {
  constructor(
    private configService: ConfigService,
    private projectService: ProjectService,
    private historyService: HistoryService,
  ) {
  }

  @Get('/')
  async index(@Param('project_name') name: string): Promise<ConfigsResponse> {
    const configs = await this.configService.findListByProjectName(name)
    return { configs }
  }

  @Get('/:id')
  async show(@Param('id') id: string): Promise<ConfigResponse> {
    const config = await this.configService.findOneById(id)
    return { config }
  }

  @Post('/')
  @UseBefore(IsAllowContentMiddleware)
  async create(
    @Body() body: Config,
    @Param('project_name') projectName: string,
    @Ctx() context: Context,
  ): Promise<ConfigResponse> {
    const config = pick(body, ['name', 'description', 'url', 'content', 'tags'])
    const assignedConfig = Object.assign({}, config, {
      project_name: projectName,
      content: JSON.stringify(config.content),
      project_id: context._project.id,
    })
    const [err, created] = await to(this.configService.create(assignedConfig))
    if (err) throw new BadRequestError(Tips.CONFIG_CREATED_ERROR)
    return { config: created }
  }

  @Get('/:id/histories')
  async histories(@Param('id') id: string): Promise<HistoriesResponse> {
    const histories = await this.historyService.list(id)
    return { histories }
  }

  @Post('/:id/deployment')
  async deployment(
    @Param('id') id: string,
    @CurrentUser({ required: true }) user: User,
  ): Promise<DeploymentResponse> {
    const config = await this.configService.findOneById(id)
    const [createErr, created] = await to(this.historyService.create({
      config_id: config.id,
      user_id: user.id,
      content: config.content,
    }))
    const [updateErr, updated] = await to(this.configService.updateLastPublish(config))
    if (createErr || updateErr) throw new BadRequestError(Tips.DEPLOYMENT_ERROR)
    return { config: updated, history: created }
  }
}
