import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Event } from '../event/event.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: 'mongodb+srv://nest-gql:U7BqTpzSNIjAGoPo@cluster0.98dgb.mongodb.net/nest-gql?retryWrites=true&w=majority',
  synchronize: true,
  useUnifiedTopology: true,
  entities: [User, Event],
};
