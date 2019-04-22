import {
  Entity, BaseEntity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Column, Index,
} from 'typeorm'

@Entity('projects')
export class Project extends BaseEntity {

  @ObjectIdColumn()
  id: string

  @Column()
  @Index({ unique: true })
  name: string

  @Column()
  users: Array<string> = []

  @Column()
  configs: Array<string> = []

  @Column()
  description: string

  @Column()
  url_base: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

}
