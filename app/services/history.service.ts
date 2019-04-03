import { getMongoRepository, MongoRepository } from 'typeorm'
import { Service } from 'typedi'
import { History } from '../entities'

@Service()
export class HistoryService {
  repository: MongoRepository<History>

  constructor() {
    this.repository = getMongoRepository(History)
  }

  async list(configId: string): Promise<any> {
    return await this.repository.find({ config_id: configId })
  }

  async create(payload: any): Promise<any> {
    return await this.repository.save(payload)
  }
}
