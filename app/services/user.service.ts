import { getMongoRepository, MongoRepository } from 'typeorm'
import { Service } from 'typedi'
import { sign } from 'jsonwebtoken'
import { compare, genSalt, hash } from 'bcrypt'
import { User } from '../entities'

@Service()
export class UserService {
  repository: MongoRepository<User>

  constructor() {
    this.repository = getMongoRepository(User)
  }

  async findOneByName(userName: string): Promise<User | null> {
    return await this.repository.findOne({ username: userName })
  }

  async findListByIds(ids: string[]): Promise<Array<User | null>> {
    return await this.repository.findByIds(ids)
  }
}
