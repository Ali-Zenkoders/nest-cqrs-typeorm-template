import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { RequestOtpCommand } from '../request-otp.command';
import { returnException } from 'src/utils/return-exception';
import { GetUserQuery } from 'src/modules/features/user/queries/get-user.query';
import { SendOtpEmailEvent } from '../../../events/send-otp-email.event';

@CommandHandler(RequestOtpCommand)
export class RequestOtpHandler implements ICommandHandler<RequestOtpCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: RequestOtpCommand,
  ): Promise<typeof RequestOtpCommand.returnType> {
    const { email, purpose } = command;

    try {
      const [userData, userError]: typeof GetUserQuery.returnType =
        await this.queryBus.execute(new GetUserQuery(undefined, email));

      if (userError) {
        return returnException(RequestOtpHandler.name, userError);
      }

      const { id, name } = userData;

      this.eventBus.publish(new SendOtpEmailEvent(id, name, email, purpose));

      return [{ message: 'Otp sent successfully' }, null];
    } catch (error) {
      return returnException(RequestOtpHandler.name, error);
    }
  }
}
