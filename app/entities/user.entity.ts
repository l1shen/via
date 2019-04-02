import { MinLength, IsNotEmpty } from 'class-validator'
import {
  Entity, BaseEntity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Column, Index,
} from 'typeorm'

/**
 * All validator can be applied to all controllers.
 * Reference document: https://github.com/typestack/class-validator
 * How to auto validaing? see: https://github.com/typestack/routing-controllers#auto-validating-action-params
 */

@Entity('users')
export class User extends BaseEntity {
  
  @ObjectIdColumn()
  id: string

  @Column()
  @MinLength(4, { message: 'username too short' })
  @IsNotEmpty({ message: 'must include username' })
  @Index({ unique: true })
  username: string

  @Column()
  @MinLength(10)
  token: string

  @Column()
  password: string
  
  @CreateDateColumn()
  created_at: Date
  
  @UpdateDateColumn()
  updated_at: Date
}
