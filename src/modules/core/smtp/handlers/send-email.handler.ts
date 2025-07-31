import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailCommand } from '../commands/send-email.command';
import { returnException } from 'src/utils/return-exception';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
  private transport: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private readonly configService: ConfigService) {
    this.transport = this.createMailTransport();
  }

  private createMailTransport(): Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  > {
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

  async execute(
    command: SendEmailCommand,
  ): Promise<typeof SendEmailCommand.returnType> {
    const { from, recipients, subject, html } = command;

    const options: Mail.Options = {
      from: from ?? {
        name: this.configService.getOrThrow('SMTP_APP_NAME'),
        address: this.configService.getOrThrow('SMTP_DEFAULT_MAIL_FROM'),
      },
      to: recipients,
      subject,
      html,
    };

    try {
      const result = await this.transport.sendMail(options);

      return [result, null];
    } catch (error) {
      return returnException(SendEmailHandler.name, error);
    }
  }
}
