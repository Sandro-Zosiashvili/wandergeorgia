import { Injectable, Logger } from '@nestjs/common';
import type { CreateBookingDto } from './dto/create-booking.dto';
import { MailService } from './mail.service';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(private readonly mail: MailService) {}

  async submit(dto: CreateBookingDto): Promise<{ ok: true }> {
    // Honeypot tripped → almost certainly a bot. Pretend success, send nothing.
    if (dto.company) {
      this.logger.warn(`Honeypot tripped for "${dto.email}" — dropped silently.`);
      return { ok: true };
    }

    await this.mail.sendBookingEmails(dto);
    this.logger.log(`Booking request emailed for "${dto.name}" — ${dto.tourTitle}.`);
    return { ok: true };
  }
}
