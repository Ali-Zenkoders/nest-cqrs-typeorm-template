import { TypedCommand } from 'src/common/classes';
import { Result } from 'src/common/types';

export class ResetPasswordCommand extends TypedCommand<
  Result<{ message: string }>
> {
  constructor(
    public readonly otp: string,
    public readonly password: string,
  ) {
    super();
  }

  static readonly returnType: Result<{ message: string }>;
}
