import { TypedCommand } from 'src/common/classes';
import { Result } from 'src/common/types';
import { UserEntity } from '../../user/entities/user.entity';

export class LoginCommand extends TypedCommand<
  Result<{
    message: string;
    accessToken: string | null;
    isVerified: boolean;
    user: UserEntity | null;
  }>
> {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly skipMatch: boolean = false,
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
