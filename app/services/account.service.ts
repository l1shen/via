import { getMongoRepository, MongoRepository } from 'typeorm'
import { Service } from 'typedi'
import { createHash } from 'crypto'
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
    const sha256 = createHash('sha256')
    sha256.update(password)
    const isSignIn = sha256.digest('hex') === user.password
    return isSignIn ? user : null
  }

  async signUp(username: string, password: string): Promise<User> {
    const sha256 = createHash('sha256')
    const hashedPassword = sha256.update(password)
    return await this.repository.save({ username, password: hashedPassword.digest('hex') })
  }
}
