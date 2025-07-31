import { Injectable, Logger } from '@nestjs/common';
import { OtpRepository } from '../repositories/otp.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IsNull, MoreThan } from 'typeorm';

@Injectable()
export class RemoveExpireOtpScheduler {
  private readonly logger = new Logger(RemoveExpireOtpScheduler.name);
  constructor(private readonly otpRepo: OtpRepository) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async removeAllExpireOtp() {
    const now = new Date();
    try {
      const expireOtps = await this.otpRepo.find({
        where: {
          expires_at: MoreThan(now),
          deleted_at: IsNull(),
        },
        select: ['id'],
      });

      const otpIds = expireOtps.map((otp) => otp.id);

      if (otpIds.length) {
        await this.otpRepo.delete(otpIds);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
