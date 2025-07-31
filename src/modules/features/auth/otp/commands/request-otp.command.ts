import { TypedCommand } from 'src/common/classes';
import { Result } from 'src/common/types';
import { OtpPurpose } from '../enums/otp-purpose.enum';

export class RequestOtpCommand extends TypedCommand<
  Result<{ message: string }>
> {
  constructor(
    public readonly email: string,
    public readonly purpose: OtpPurpose,
  ) {
    super();
  }

  static readonly returnType: Result<{ message: string }>;
}
