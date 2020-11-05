import { Module } from '@nestjs/common';
import { EventsModule } from './event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), EventsModule, AuthModule],
})
export class AppModule { }
