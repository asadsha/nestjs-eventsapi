import { Injectable, NotFoundException, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { EventRepository } from './event.repository';
import { Event } from './event.entity';
import { User } from '../auth/user.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { UploadToAws } from '../utils/aws-bucket.js';

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

  // cron job to run when the current second is 45
  @Cron('45 * * * * *')
  handleCron() {
    console.log('Called when the current second is 45');
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto, user: User, file: File): Promise<Event> {
    const imageUrl = await UploadToAws(file);
    if (imageUrl) {
      const { title, description } = updateEventDto;
      const event = await this.getEventById(id);
      event.title = title;
      event.description = description;
      event.imageUrl = imageUrl;
      await event.save();
      return event;
    }
    throw new InternalServerErrorException('Internal Server Error! Try Again Later.');
  }
}
