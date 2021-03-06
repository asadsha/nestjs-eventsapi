import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  // Query,
  ParseIntPipe,
  UseGuards,
  Req,
  Logger,
  UnauthorizedException,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './dto/update-event.dto';

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
  @UseInterceptors(FileInterceptor('file'))
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req,
    @UploadedFile() file
  ): Promise<Event> {
    if (req.user.userType !== "admin") {
      throw new UnauthorizedException('Not Authorized');
    }
    if (file !== undefined) {
      this.logger.verbose(`user ${req.user.name} creating a new event. Data: ${JSON.stringify(createEventDto)}`);
      return this.eventsService.createEvent(createEventDto, req.user, file);
    } else {
      throw new BadRequestException('Image is required');
    }
  }

  @Delete('/:id')
  deleteEvent(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {
    this.logger.verbose(`user ${req.user.name} deleting task`); // logging info
    return this.eventsService.deleteEvent(id);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req,
    @UploadedFile() file
  ): Promise<Event> {
    this.logger.verbose(`user ${req.user.name} updating task.`); // logging info
    if (file !== undefined) {
      return this.eventsService.updateEvent(id, updateEventDto, req.user, file);
    } else {
      throw new BadRequestException('Image is required');
    }
  }
}
