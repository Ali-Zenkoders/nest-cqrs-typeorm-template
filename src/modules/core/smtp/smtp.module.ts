import { Module } from '@nestjs/common';
import { SmtpService } from './services/smtp.service';
import { SendEmailHandler } from './handlers/send-email.handler';

@Module({
  providers: [SmtpService, SendEmailHandler],
})
export class SmtpModule {}
