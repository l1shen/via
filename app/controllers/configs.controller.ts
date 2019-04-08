import {
  Body, Get, JsonController, Post, QueryParam, UseInterceptor,
  BodyParam, Req, Authorized, Param, HttpError, CurrentUser, BadRequestError,
} from 'routing-controllers'
import to from 'await-to-js'
import { ConfigService, HistoryService, ProjectService } from '../services'
import { Config, User } from '../entities'
import { pick } from '../helpers'
import { Tips } from '../constants'
import { DeploymentType, Histories, ConfigType, Configs } from '../types'
import {ParseError} from '../errors/parse.error'



@Authorized()
@JsonController('/projects/:project_name/configs')
export class ConfigsController {
  constructor(
    private configService: ConfigService,
    private projectService: ProjectService,
    private historyService: HistoryService,
  ) {
  }

  @Get('/')
  async index(@Param('project_name') name: string): Promise<Configs> {
    const configs = await this.configService.findListByProjectName(name)
    return { configs }
  }

  @Get('/:id')
  async show(@Param('id') id: string): Promise<ConfigType> {
    const config = await this.configService.findOneById(id)
    return { config }
  }

  @Post('/')
  async create(
    @Body() body: Config,
    @Param('project_name') projectName: string,
  ): Promise<ConfigType> {
    const config = pick(body, ['name', 'description', 'url', 'content', 'tags'])
    const configWithProjectName = Object.assign({}, config, {
      project_name: projectName,
      content: JSON.stringify(config.content),
    })
    const [err, created] = await to(this.configService.create(configWithProjectName))
    if (err instanceof ParseError) throw new BadRequestError(Tips.CONFIG_PARSE_ERROR)
    if (err) throw new BadRequestError(Tips.CONFIG_CREATED_ERROR)
    return { config: created }
  }

  @Get('/:id/histories')
  async histories(@Param('id') id: string): Promise<Histories> {
    const histories = await this.historyService.list(id)
    return { histories }
  }

  @Post('/:id/deployment')
  async deployment(
    @Param('id') id: string,
    @CurrentUser({ required: true }) user: User,
  ): Promise<DeploymentType> {
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
