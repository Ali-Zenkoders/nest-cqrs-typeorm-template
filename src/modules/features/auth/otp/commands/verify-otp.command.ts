import { TypedCommand } from 'src/common/classes';
import { Result } from 'src/common/types';
import { UserEntity } from '../../../user/entities/user.entity';
import { OtpPurpose } from '../enums/otp-purpose.enum';

export class VerifyOtpCommand extends TypedCommand<
  Result<{
    message: string;
    accessToken: string | null;
    isVerified: boolean;
    user: UserEntity | null;
  }>
> {
  constructor(
    public readonly code: string,
    public readonly purpose: OtpPurpose,
  ) {
    super();
  }

  static readonly returnType: Result<{
    message: string;
    accessToken: string | null;
    isVerified: boolean;
    user: UserEntity | null;
  }>;
}
