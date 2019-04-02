import { MinLength, IsNotEmpty } from 'class-validator'
import {
  Entity, BaseEntity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Column, Index,
} from 'typeorm'

@Entity('configs')
export class Config extends BaseEntity {

  @ObjectIdColumn()
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  url: string

  @Column()
  content: string | Object

  @Column()
  histories: Array<Object>

  @Column()
  last_publish: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}