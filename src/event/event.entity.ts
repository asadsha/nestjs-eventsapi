import { Entity, BaseEntity, Column, OneToMany, ObjectIdColumn } from 'typeorm';
// import { User } from '../auth/user.entity';

@Entity()
export class Event extends BaseEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  userId: string;

  // @Column()
  // imageUrl: string;

  // @OneToMany(type => User, user => user.event, { eager: true })
  // users: User[];
}