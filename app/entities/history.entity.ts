import { MinLength, IsNotEmpty } from 'class-validator'
import {
  Entity, BaseEntity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Column, Index,
} from 'typeorm'

@Entity('histories')
export class History extends BaseEntity {

  @ObjectIdColumn()
  id: string

  @Column()
  @IsNotEmpty({ message: 'must include config_id' })
  config_id: string

  @Column()
  @IsNotEmpty({ message: 'must include user_id' })
  user_id: string

  @Column()
  content: string | Object

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
