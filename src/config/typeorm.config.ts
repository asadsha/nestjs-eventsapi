import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as env from 'dotenv';
import { User } from '../auth/user.entity';
import { Event } from '../event/event.entity';
env.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.DB_URI,
  synchronize: true,
  useUnifiedTopology: true,
  entities: [User, Event],
};
