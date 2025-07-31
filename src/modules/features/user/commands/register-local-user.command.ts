import { TypedCommand } from 'src/common/classes';
import { Result } from 'src/common/types';

export class RegisterLocalUserCommand extends TypedCommand<
  Result<{ message: string; userId: string }>
> {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly isAgreed: boolean,
  ) {
    super();
  }

  static readonly returnType: Result<{ message: string; userId: string }>;
}
