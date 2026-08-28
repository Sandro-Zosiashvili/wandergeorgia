import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { CreateBookingDto } from './dto/create-booking.dto';
import { buildAdminEmail, buildCustomerEmail } from './email-templates';

/**
 * Wraps a single Nodemailer transport (Gmail SMTP via App Password) and knows
 * how to send the two booking emails: one to the admin, one to the customer.
 */
@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter!: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_APP_PASSWORD');

    if (!user || !pass) {
      this.logger.warn(
        'MAIL_USER / MAIL_APP_PASSWORD are not set — emails will fail until you fill in .env',
      );
    }

    // Gmail SMTP. `service: 'gmail'` picks the right host/port automatically.
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  /**
   * Send both emails for one booking. The admin email is the important one —
   * if the customer copy fails we don't want to fail the whole request, so it's
   * best-effort and logged.
   */
  async sendBookingEmails(dto: CreateBookingDto): Promise<void> {
    const from = `"WanderGeorgia" <${this.config.get<string>('MAIL_USER')}>`;
    const adminTo = this.config.get<string>('ADMIN_EMAIL');

    const admin = buildAdminEmail(dto);
    const customer = buildCustomerEmail(dto);

    // 1) Admin — must succeed. Reply-To = customer so the team can reply directly.
    await this.transporter.sendMail({
      from,
      to: adminTo,
      replyTo: `"${dto.name}" <${dto.email}>`,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
    });

    // 2) Customer copy — best-effort.
    try {
      await this.transporter.sendMail({
        from,
        to: dto.email,
        subject: customer.subject,
        text: customer.text,
        html: customer.html,
      });
    } catch (err) {
      this.logger.error(
        `Booking saved & admin notified, but the customer copy to ${dto.email} failed.`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }
}
