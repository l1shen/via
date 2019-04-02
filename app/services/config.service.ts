import { getMongoRepository, MongoRepository } from 'typeorm'
import { Service } from 'typedi'
import { Config } from '../entities'

@Service()
export class ConfigService {
  repository: MongoRepository<Config>

  constructor() {
    this.repository = getMongoRepository(Config)
  }

  async list(): Promise<any> {
    return await this.repository.find({})
  }

  async findOneById(id: string): Promise<Config> {
    return await this.repository.findOne(id)
  }
}
