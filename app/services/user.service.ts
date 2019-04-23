import { getMongoRepository, MongoRepository } from 'typeorm'
import { Service } from 'typedi'
import { User } from 'entities'

@Service()
export class UserService {
  repository: MongoRepository<User>

  constructor() {
    this.repository = getMongoRepository(User)
  }

  async findOneByName(username: string): Promise<User | null> {
    return await this.repository.findOne({ username })
  }

  async findListByIds(ids: string[]): Promise<Array<User | null>> {
    return await this.repository.findByIds(ids)
  }
}
