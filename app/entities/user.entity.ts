import { MinLength, IsNotEmpty } from 'class-validator'
import {
  Entity, BaseEntity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Column, Index,
} from 'typeorm'


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
  @IsNotEmpty({ message: 'must include password' })
  password: string
  
  @CreateDateColumn()
  created_at: Date
  
  @UpdateDateColumn()
  updated_at: Date
}
