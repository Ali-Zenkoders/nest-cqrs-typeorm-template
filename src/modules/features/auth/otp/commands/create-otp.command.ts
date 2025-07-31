import { OtpPurpose } from '../enums/otp-purpose.enum';
import { Result } from 'src/common/types';
import { OtpEntity } from '../entities/otp.entity';
import { TypedCommand } from 'src/common/classes';

export class CreateOtpCommand extends TypedCommand<Result<OtpEntity>> {
  constructor(
    public readonly userId: string,
    public readonly purpose: OtpPurpose,
  ) {
    super();
  }

  static readonly returnType: Result<OtpEntity>;
}
