import {
  Entity,
  BaseEntity,
  ObjectIdColumn,
  Column,
  Unique,
  ManyToOne
} from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { Event } from '../event/event.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  userType: string;

  // @ManyToOne(type => Event, event => event.users, { eager: false })
  // event: Event;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
