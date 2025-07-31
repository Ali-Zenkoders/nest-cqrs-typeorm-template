import { TypedQuery } from 'src/common/classes';
import { Result } from 'src/common/types';
import { OtpEntity } from '../entities/otp.entity';
import { OtpPurpose } from '../enums/otp-purpose.enum';

export class GetOtpQuery extends TypedQuery<Result<OtpEntity>> {
  constructor(
    public readonly code: string,
    public readonly purpose: OtpPurpose,
  ) {
    super();
  }

  static readonly returnType: Result<OtpEntity>;
}
