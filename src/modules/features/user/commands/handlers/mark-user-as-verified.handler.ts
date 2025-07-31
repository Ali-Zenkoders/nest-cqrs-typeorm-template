import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkUserAsVerifiedCommand } from '../mark-user-as-verified.command';
import { UserRepository } from '../../repositories/user.repository';
import { returnException } from 'src/utils/return-exception';
import { HttpStatus } from '@nestjs/common';

@CommandHandler(MarkUserAsVerifiedCommand)
export class MarkUserAsVerifiedHandler
  implements ICommandHandler<MarkUserAsVerifiedCommand>
{
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    command: MarkUserAsVerifiedCommand,
  ): Promise<typeof MarkUserAsVerifiedCommand.returnType> {
    const { userId } = command;
    try {
      const user = await this.userRepo.findById(userId);

      if (!user) {
        return returnException(
          MarkUserAsVerifiedHandler.name,
          'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const { affected } = await this.userRepo.update(
        { id: userId },
        { is_verified: true },
      );

      if (affected) {
        const updatedUser = await this.userRepo.findById(userId);
        if (!updatedUser) {
          return returnException(
            MarkUserAsVerifiedHandler.name,
            'User not found after update',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return [updatedUser, null];
      }

      return returnException(
        MarkUserAsVerifiedHandler.name,
        'Unable to verify account',
      );
    } catch (error) {
      return returnException(MarkUserAsVerifiedHandler.name, error);
    }
  }
}
