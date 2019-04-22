import { getMongoRepository, MongoRepository } from 'typeorm'
import { Service } from 'typedi'
import { Project } from 'entities'

@Service()
export class ProjectService {
  repository: MongoRepository<Project>

  constructor() {
    this.repository = getMongoRepository(Project)
  }

  async list(): Promise<any> {
    return await this.repository.find({})
  }

  async findOneByName(name: string): Promise<Project | null> {
    return await this.repository.findOne({ name })
  }

  async create(project: any): Promise<Project> {
    return await this.repository.save(project)
  }
}
