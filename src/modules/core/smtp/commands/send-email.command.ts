import { Address } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { TypedCommand } from 'src/common/classes';
import { Result } from 'src/common/types';

export class SendEmailCommand extends TypedCommand<
  Result<SMTPTransport.SentMessageInfo>
> {
  constructor(
    public recipients: Address[],
    public subject: string,
    public html: string,
    public from?: Address,
  ) {
    super();
  }

  static readonly returnType: Result<SMTPTransport.SentMessageInfo>;
}
