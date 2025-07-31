import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendMailDto } from '../dtos/send-mail.dto';
import { Result } from 'src/common/types';
import { returnException } from 'src/utils/return-exception';

@Injectable()
export class SmtpService {
  private transport: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private readonly configService: ConfigService) {
    this.transport = this.createMailTransport();
  }

  private createMailTransport() {
    const transporter = createTransport({
      host: this.configService.getOrThrow('SMTP_HOST'),
      port: +this.configService.getOrThrow('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.getOrThrow('SMTP_USER'),
        pass: this.configService.getOrThrow('SMTP_PASSWORD'),
      },
    });

    return transporter;
  }

  // TODO: convert it in a command
  async sendMail(
    dto: SendMailDto,
    headers?: Mail.Headers,
  ): Promise<Result<SMTPTransport.SentMessageInfo>> {
    const { from, recipients, subject, html } = dto;

    const options: Mail.Options = {
      from: from ?? {
        name: this.configService.getOrThrow('SMTP_APP_NAME'),
        address: this.configService.getOrThrow('SMTP_DEFAULT_MAIL_FROM'),
      },
      to: recipients,
      subject,
      html,
      headers,
    };

    try {
      const result = await this.transport.sendMail(options);

      return [result, null];
    } catch (error) {
      return returnException(this.sendMail.name, error);
    }
  }
}
