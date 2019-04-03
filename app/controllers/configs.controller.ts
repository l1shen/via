import {
  Body, Get, JsonController, Post, QueryParam, UseInterceptor,
  BodyParam, Req, Authorized, Param, HttpError, CurrentUser, BadRequestError,
} from 'routing-controllers'
import { ConfigService, HistoryService, ProjectService } from '../services'
import { Config, User } from '../entities'
import { pick } from '../helpers'
import { Tips } from '../constants'
import { Binary } from 'mongodb'

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
  async index(@Param('project_name') name: string): Promise<any> {
    const configs = await this.configService.findListByProjectName(name)
    return { configs }
  }

  @Get('/:id')
  async show(@Param('id') id: string): Promise<any> {
    const config = await this.configService.findOneById(id)
    return { config }
  }

  @Post('/')
  async create(@Body() body: Config, @Param('project_name') projectName: string): Promise<any> {
    const config = pick(body, ['name', 'description', 'url', 'content', 'tags'])
    config['project_name'] = projectName
    config.content = JSON.stringify(config.content)
    try {
      const created = await this.configService.create(config)
      return { config: created }
    } catch (e) {
      console.log(e)
      throw new BadRequestError(Tips.CONFIG_CREATED_ERROR)
    }
  }

  @Get('/:id/histories')
  async histories(@Param('id') id: string): Promise<any> {
    const histories = await this.historyService.list(id)
    return { histories }
  }

  @Post('/:id/deployment')
  async deployment(@Param('id') id: string, @CurrentUser({ required: true }) user: User): Promise<any> {
    const config = await this.configService.findOneById(id)
    try {
      const created = await this.historyService.create({
        config_id: config.id,
        user_id: user.id,
        content: config.content,
      })
      const updated = await this.configService.updateLastPublish(config)
      return { config: updated, history: created }
    } catch (e) {
      console.log(e)
      throw new BadRequestError()
    }
  }
}
