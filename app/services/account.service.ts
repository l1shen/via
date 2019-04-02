import { getMongoRepository, MongoRepository } from 'typeorm'
import { Service } from 'typedi'
import { sign } from 'jsonwebtoken'
import { compare, genSalt, hash } from 'bcrypt'
import { User } from '../entities'


@Service()
export class AccountService {
  repository: MongoRepository<User>
  
  constructor() {
    this.repository = getMongoRepository(User)
  }
  
  async signIn(userName: string, password: string): Promise<any> {
    const user = await this.repository.findOne({ username: userName })
    if (!user) return false
    const isSignIn = await compare(password, user.password)
    return isSignIn ? user : false
  }

  async signUp(userName: string, password: string): Promise<User> {
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)
    return await this.repository.save({ username: userName, password: hashedPassword })
  }
}
