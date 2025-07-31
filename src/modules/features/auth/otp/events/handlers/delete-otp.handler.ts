import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteOtpEvent } from '../delete-otp.event';
import { OtpRepository } from '../../repositories/otp.repository';
import { Logger } from '@nestjs/common';

@EventsHandler(DeleteOtpEvent)
export class DeleteOtpHandler implements IEventHandler<DeleteOtpEvent> {
  private readonly logger = new Logger(DeleteOtpHandler.name);
  constructor(private readonly otpRepo: OtpRepository) {}

  async handle(event: DeleteOtpEvent): Promise<void> {
    const { code } = event;
    try {
      const { affected } = await this.otpRepo.deleteOtp(code);

      if (affected) {
        this.logger.log(`${code} otp deleted successfully`);
      } else {
        this.logger.error(`Unable to delete ${code} otp`);
      }
      return;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
