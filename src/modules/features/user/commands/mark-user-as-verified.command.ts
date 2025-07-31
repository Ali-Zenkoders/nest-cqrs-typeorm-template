import { TypedCommand } from 'src/common/classes';
import { Result } from 'src/common/types';
import { UserEntity } from '../entities/user.entity';

export class MarkUserAsVerifiedCommand extends TypedCommand<
  Result<UserEntity>
> {
  constructor(public readonly userId: string) {
    super();
  }

  static readonly returnType: Result<UserEntity>;
}
