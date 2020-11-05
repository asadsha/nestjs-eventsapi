import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  // Patch,
  // Query,
  ParseIntPipe,
  UseGuards,
  Req,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './event.entity';

@Controller('events')
@UseGuards(AuthGuard())
export class EventsController {
  private logger = new Logger('EventsController');
  constructor(private eventsService: EventsService) { }

  @Get()
  getEvents(
    @Req() req
  ): Promise<Event[]> {
    console.log(process.env.PORT);
    this.logger.verbose(`user ${req.user.name} retrieving all events.`); // logging info
    return this.eventsService.getEvents();
  }

  @Get('/:id')
  getEventById(
    @Param('id') id: string,
    @Req() req
  ): Promise<Event> {
    this.logger.verbose(`user ${req.user.name} retrieving single event by id.`);
    return this.eventsService.getEventById(id);
  }

  @Post()
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req,
  ): Promise<Event> {
    if (req.user.userType !== "admin") {
      throw new UnauthorizedException('Not Authorized');
    }
    this.logger.verbose(`user ${req.user.name} creating a new event. Data: ${JSON.stringify(createEventDto)}`);
    return this.eventsService.createEvent(createEventDto, req.user);
  }

  @Delete('/:id')
  deleteEvent(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {
    this.logger.verbose(`user ${req.user.name} deleting task`); // logging info
    return this.eventsService.deleteEvent(id);
  }

  // @Patch('/:id/status')
  // updateTaskStatus(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  //   @Req() req
  // ): Promise<Event> {
  //   this.logger.verbose(`user ${req.user.name} updating task. Status: ${status}`); // logging info
  //   return this.eventsService.updateTaskStatus(id, status, req.user);
  // }
}
