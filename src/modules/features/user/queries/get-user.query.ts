import { TypedQuery } from 'src/common/classes';
import { Result } from 'src/common/types';
import { UserEntity } from '../entities/user.entity';

export class GetUserQuery extends TypedQuery<Result<UserEntity>> {
  constructor(
    public readonly id?: string,
    public readonly email?: string,
  ) {
    super();
  }

  static readonly returnType: Result<UserEntity>;
}
