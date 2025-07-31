import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePasswordCommand } from '../update-password.command';
import { UserRepository } from '../../repositories/user.repository';
import { returnException } from 'src/utils/return-exception';
import { compare, hash } from 'bcrypt';
import { SALT_ROUND } from 'src/common/constants';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    command: UpdatePasswordCommand,
  ): Promise<typeof UpdatePasswordCommand.returnType> {
    const { userId, password } = command;
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });

      if (!user || !user.password) {
        return returnException(UpdatePasswordHandler.name, 'User not found!');
      }

      const isOldPassword = await compare(password, user.password);

      if (isOldPassword) {
        return returnException(
          UpdatePasswordHandler.name,
          'New password must be different from old password',
        );
      }

      const hashPassword = await hash(password, SALT_ROUND);

      const { affected } = await this.userRepo.update(
        { id: userId },
        { password: hashPassword },
      );

      if (affected) {
        return [{ message: 'Password reset successfully' }, null];
      }

      return returnException(
        UpdatePasswordHandler.name,
        'Unable to update password',
      );
    } catch (error) {
      return returnException(UpdatePasswordHandler.name, error);
    }
  }
}
