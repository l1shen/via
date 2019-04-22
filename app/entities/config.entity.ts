import {
  Entity, BaseEntity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Column,
} from 'typeorm'

@Entity('configs')
export class Config extends BaseEntity {

  @ObjectIdColumn()
  id: string

  @Column()
  project_id: string

  @Column()
  project_name: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  url: string

  @Column()
  content: string

  @Column()
  tags: Array<string>

  @Column()
  histories: Array<string>

  @Column()
  version: Date

  @Column()
  last_publish: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
