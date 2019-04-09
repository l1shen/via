import { getMongoRepository, MongoRepository } from 'typeorm'
import { Service } from 'typedi'
import { Config } from '../entities'

@Service()
export class ConfigService {
  repository: MongoRepository<Config>

  constructor() {
    this.repository = getMongoRepository(Config)
  }

  async list(): Promise<Array<Config | null>> {
    return await this.repository.find({})
  }

  async findOneById(id: string): Promise<Config> {
    return await this.repository.findOne(id)
  }

  async findListByProjectName(name: string): Promise<Array<Config | null>> {
    return await this.repository.find({ where: { project_name: name } })
  }

  async create(config: any): Promise<Config | null> {
    return await this.repository.save(config)
  }

  async updateLastPublish(config: Config): Promise<Config> {
    config.last_publish = new Date()
    return await this.repository.save(config)
  }
}
