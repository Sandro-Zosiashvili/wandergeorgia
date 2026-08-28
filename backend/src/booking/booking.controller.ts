import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly booking: BookingService) {}

  /** POST /booking — receive a booking request and email admin + customer. */
  @Post()
  @HttpCode(200)
  async create(@Body() dto: CreateBookingDto): Promise<{ ok: true }> {
    return this.booking.submit(dto);
  }
}
