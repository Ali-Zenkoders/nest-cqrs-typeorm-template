import { TypedCommand } from 'src/common/classes';
import { Result } from 'src/common/types';

export class UpdatePasswordCommand extends TypedCommand<
  Result<{ message: string }>
> {
  constructor(
    public readonly userId: string,
    public readonly password: string,
  ) {
    super();
  }

  static readonly returnType: Result<{ message: string }>;
}
