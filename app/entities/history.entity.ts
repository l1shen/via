import { MinLength, IsNotEmpty } from 'class-validator'
import {
  Entity, BaseEntity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Column, Index,
} from 'typeorm'

@Entity('histories')
export class History extends BaseEntity {

  @ObjectIdColumn()
  id: string

  @Column()
  config_id: string

  @Column()
  user_id: string

  @Column()
  content: string | Object

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
