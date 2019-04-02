import {
  Body, Get, JsonController, Post, QueryParam, UseInterceptor,
  BodyParam, UnauthorizedError, Req, BadRequestError, Authorized, Param,
} from 'routing-controllers'
import { ProjectService } from '../services'
import { Project } from '../entities'

@Authorized()
@JsonController('/projects')
export class ProjectsController {
  constructor(
    private projectService: ProjectService,
  ) {}

  @Get('/')
  async index(): Promise<any> {
    const projects = this.projectService.list()
    return { projects }
  }

  @Get('/:name')
  async show(@Param('name') name: string): Promise<any> {
    const project = await this.projectService.findOneByName(name)
    return { project }
  }

  @Post('/')
  async create(@Body() project: Project): Promise<any> {

  }

}
