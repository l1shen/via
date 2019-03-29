import { MinLength, IsNotEmpty } from 'class-validator'
import {
  Entity, BaseEntity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

/**
 * All validator can be applied to all controllers.
 * Reference document: https://github.com/typestack/class-validator
 * How to auto validaing? see: https://github.com/typestack/routing-controllers#auto-validating-action-params
 */

@Entity('sessions')
export class Session extends BaseEntity {
  
  @ObjectIdColumn()
  id: string
  
  @MinLength(4, { message: 'username too short' })
  @IsNotEmpty({ message: 'must include username' })
  username: string
  
  @MinLength(10)
  token: string
  
  @CreateDateColumn()
  created_at: Date
  
  @UpdateDateColumn()
  updated_at: Date
}
