import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserLoggedInEvent } from '../user-logged-in.event';
import { UserRepository } from '../../repositories/user.repository';
import { Logger } from '@nestjs/common';

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInHandler implements IEventHandler<UserLoggedInEvent> {
  private readonly logger = new Logger(UserLoggedInHandler.name);

  constructor(private readonly userRepo: UserRepository) {}

  async handle(event: UserLoggedInEvent): Promise<void> {
    const { userId } = event;
    try {
      const { affected } = await this.userRepo.updateLastLogin(userId);

      if (affected) {
        this.logger.log(`User last login updated: ${userId}`);
      } else {
        this.logger.error(`Unable to update last login: ${userId}`);
      }
      return;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
