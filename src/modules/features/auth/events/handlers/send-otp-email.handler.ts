import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SendOtpEmailEvent } from '../send-otp-email.event';
import { SendEmailCommand } from 'src/modules/core/smtp/commands/send-email.command';
import { CreateOtpCommand } from '../../otp/commands/create-otp.command';
import { OtpPurpose } from '../../otp/enums/otp-purpose.enum';
import { renderFile } from 'ejs';
import { join } from 'path';
import { TEMPLATES_PATH } from 'src/common/constants';
import { Logger } from '@nestjs/common';

@EventsHandler(SendOtpEmailEvent)
export class SendOtpEmailHandler implements IEventHandler<SendOtpEmailEvent> {
  private readonly logger = new Logger(SendOtpEmailHandler.name);
  constructor(private commandBus: CommandBus) {}

  private otpEmailMetadata(purpose: OtpPurpose) {
    if (purpose === OtpPurpose.VERIFICATION) {
      return {
        templateFileName: 'account-verification.ejs',
        templateFileError: 'Unable to read account verification ejs',
        templateSubject: 'Account Verification',
        templateMessage: 'Verification email sent successfully',
      };
    } else if (purpose === OtpPurpose.FORGOT_PASSWORD) {
      return {
        templateFileName: 'password-reset-verification.ejs',
        templateFileError: 'Unable to read password reset verification ejs',
        templateSubject: 'Password Reset Verification',
        templateMessage: 'Password reset verification email sent successfully',
      };
    } else {
      return {
        templateFileName: '',
        templateFileError: '',
        templateSubject: '',
        templateMessage: '',
      };
    }
  }

  async handle(event: SendOtpEmailEvent): Promise<void> {
    const { id, name, email, purpose } = event;
    try {
      const [otpData, otpError]: typeof CreateOtpCommand.returnType =
        await this.commandBus.execute(new CreateOtpCommand(id, purpose));

      if (otpError) {
        this.logger.error(otpError);
        return;
      }

      const {
        templateFileName,
        templateFileError,
        templateSubject,
        templateMessage,
      } = this.otpEmailMetadata(purpose);

      let htmlText: string | null = null;
      renderFile(
        join(TEMPLATES_PATH, 'auth', templateFileName),
        {
          name,
          otp: otpData.code,
        },
        {},
        (err, str) => {
          if (err) {
            this.logger.error(err);
          }

          htmlText = str;
        },
      );

      if (!htmlText) {
        this.logger.error(templateFileError);
        return;
      }

      await this.commandBus.execute(
        new SendEmailCommand(
          [{ name, address: email }],
          templateSubject,
          htmlText,
        ),
      );

      this.logger.log(templateMessage);
      return;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
