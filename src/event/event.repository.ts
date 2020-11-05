import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  private logger = new Logger('TaskRepository');

  async createEvent(createEventDto: CreateEventDto, user: User): Promise<Event> {
    const { title, description } = createEventDto;

    const event = new Event();
    event.title = title;
    event.description = description;
    event.userId = user._id;
    try {
      await event.save();
    } catch (error) {
      this.logger.error(`Failed to save error by user. DTO : ${JSON.stringify(createEventDto)}`, error.stack);
      throw new InternalServerErrorException('Internal Server Error! Try Again Later');
    }

    // delete task.user;

    return event;
  }
}
