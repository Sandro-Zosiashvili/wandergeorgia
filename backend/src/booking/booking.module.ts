import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MailService } from './mail.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, MailService],
})
export class BookingModule {}
