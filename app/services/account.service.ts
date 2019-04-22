import { getMongoRepository, MongoRepository } from 'typeorm'
import { Service } from 'typedi'
import { sign } from 'jsonwebtoken'
import { compare, genSalt, hash } from 'bcrypt'
import { User } from 'entities'


@Service()
export class AccountService {
  repository: MongoRepository<User>
  
  constructor() {
    this.repository = getMongoRepository(User)
  }
  
  async signIn(username: string, password: string): Promise<User | null> {
    const user = await this.repository.findOne({ username })
    if (!user) return null
    const isSignIn = await compare(password, user.password)
    return isSignIn ? user : null
  }

  async signUp(username: string, password: string): Promise<User> {
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)
    return await this.repository.save({ username, password: hashedPassword })
  }
}
