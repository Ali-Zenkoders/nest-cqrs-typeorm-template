import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtpQuery } from '../get-otp.query';
import { OtpRepository } from '../../repositories/otp.repository';
import { returnException } from 'src/utils/return-exception';

@QueryHandler(GetOtpQuery)
export class GetOtpHandler implements IQueryHandler<GetOtpQuery> {
  constructor(private readonly otpRepo: OtpRepository) {}

  async execute(query: GetOtpQuery): Promise<typeof GetOtpQuery.returnType> {
    const { code, purpose } = query;
    try {
      const otp = await this.otpRepo.findOne({
        where: {
          code,
          purpose,
        },
      });

      if (!otp) {
        return returnException(GetOtpHandler.name, 'Invalid otp');
      }

      const otpExpiry = new Date(otp.expires_at);

      if (new Date() > otpExpiry) {
        return returnException(GetOtpHandler.name, 'Otp is expired');
      }

      return [otp, null];
    } catch (error) {
      return returnException(GetOtpHandler.name, error);
    }
  }
}
