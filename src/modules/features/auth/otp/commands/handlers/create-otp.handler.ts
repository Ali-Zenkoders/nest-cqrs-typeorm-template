import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOtpCommand } from '../create-otp.command';
import { OtpRepository } from '../../repositories/otp.repository';
import { returnException } from 'src/utils/return-exception';
import { MoreThan } from 'typeorm';
import { addMinutes } from 'date-fns';
import { OTP_EXPIRY } from 'src/common/constants';

@CommandHandler(CreateOtpCommand)
export class CreateOtpHandler implements ICommandHandler<CreateOtpCommand> {
  constructor(private readonly otpRepo: OtpRepository) {}

  private generateOtp(): string {
    const otp = Math.floor(100_000 + Math.random() * 900_000).toString();
    return otp;
  }

  async execute(
    command: CreateOtpCommand,
  ): Promise<typeof CreateOtpCommand.returnType> {
    const { userId, purpose } = command;
    try {
      const now = new Date();

      const existingOtp = await this.otpRepo.findOne({
        where: {
          user_id: userId,
          purpose: purpose,
          expires_at: MoreThan(now),
        },
      });

      if (existingOtp) {
        return [existingOtp, null];
      }

      const otp = this.generateOtp();
      const expiresAt = addMinutes(now, OTP_EXPIRY);

      const newOtpEntity = this.otpRepo.create({
        user_id: userId,
        purpose,
        code: otp,
        expires_at: expiresAt,
      });

      const newOtp = await this.otpRepo.save(newOtpEntity);

      return [newOtp, null];
    } catch (error) {
      return returnException(CreateOtpHandler.name, error);
    }
  }
}
