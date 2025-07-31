import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import { UserRepository } from '../../repositories/user.repository';
import { returnException } from 'src/utils/return-exception';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: GetUserQuery): Promise<typeof GetUserQuery.returnType> {
    const { id, email } = query;

    if (!id && !email) {
      return returnException(
        GetUserHandler.name,
        'Either id or email must be provided',
      );
    }

    try {
      const user = id
        ? await this.userRepo.findById(id)
        : await this.userRepo.findByEmail(email!);

      if (!user) {
        return returnException(GetUserHandler.name, 'User not found');
      }

      return [user, null];
    } catch (error) {
      return returnException(GetUserHandler.name, error);
    }
  }
}
