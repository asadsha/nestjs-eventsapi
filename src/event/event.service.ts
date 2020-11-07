import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';
import { Event } from './event.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) { }

  getEvents(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async getEventById(id: string): Promise<Event> {
    const requiredEvent = await this.eventRepository.findOne(id);
    if (!requiredEvent) {
      throw new NotFoundException(`Event with ${id} not found.`);
    }
    return requiredEvent;
  }

  async deleteEvent(id: string): Promise<void> {
    const result = await this.eventRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
  }

  async createEvent(createEventDto: CreateEventDto, user: User, file: File): Promise<Event> {
    return this.eventRepository.createEvent(createEventDto, user, file);
  }

  // async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Event> {
  //   const task = await this.getTaskById(id, user);
  //   task.status = status;
  //   await task.save();
  //   return task;
  // }
}
