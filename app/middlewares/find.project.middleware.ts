import { KoaMiddlewareInterface, NotFoundError } from 'routing-controllers'
import { ProjectService } from '../services'
import { Container } from 'typedi'
import { Tips } from '../constants'

export class FindProjectMiddleware implements KoaMiddlewareInterface {
  async use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    const projectService = Container.get(ProjectService)
    const projectName = context.params.project_name
    const project = await projectService.findOneByName(projectName)
    if (!project) return new NotFoundError(Tips.PROJECT_NOT_FOUND)
    context._project = project
    return next()
  }
}
