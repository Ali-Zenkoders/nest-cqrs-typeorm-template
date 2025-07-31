import { DeleteResult, Repository } from 'typeorm';
import { OtpEntity } from '../entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class OtpRepository extends Repository<OtpEntity> {
  constructor(@InjectRepository(OtpEntity) otpRepo: Repository<OtpEntity>) {
    super(otpRepo.target, otpRepo.manager, otpRepo.queryRunner);
  }

  async getOtpByUserId(userId: string): Promise<OtpEntity | null> {
    return await this.findOne({
      where: {
        user_id: userId,
      },
    });
  }

  async getOtpByCode(code: string): Promise<OtpEntity | null> {
    return await this.findOne({
      where: {
        code,
      },
    });
  }

  async deleteOtp(code: string): Promise<DeleteResult> {
    return await this.delete({ code });
  }
}
