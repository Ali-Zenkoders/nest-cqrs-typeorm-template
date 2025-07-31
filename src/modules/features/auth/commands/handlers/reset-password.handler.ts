import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../reset-password.command';
import { returnException } from 'src/utils/return-exception';
import { VerifyOtpCommand } from '../../otp/commands/verify-otp.command';
import { OtpPurpose } from '../../otp/enums/otp-purpose.enum';
import { GetOtpQuery } from '../../otp/queries/get-otp.query';
import { UpdatePasswordCommand } from 'src/modules/features/user/commands/update-password.command';
import { DeleteOtpEvent } from '../../otp/events/delete-otp.event';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: ResetPasswordCommand,
  ): Promise<typeof ResetPasswordCommand.returnType> {
    const { otp, password } = command;

    try {
      const [, verifyOtpError]: typeof VerifyOtpCommand.returnType =
        await this.commandBus.execute(
          new VerifyOtpCommand(otp, OtpPurpose.FORGOT_PASSWORD),
        );

      if (verifyOtpError) {
        return returnException(ResetPasswordHandler.name, verifyOtpError);
      }

      const [otpData, otpError]: typeof GetOtpQuery.returnType =
        await this.queryBus.execute(
          new GetOtpQuery(otp, OtpPurpose.FORGOT_PASSWORD),
        );

      if (otpError) {
        return returnException(ResetPasswordHandler.name, otpError);
      }

      const { user_id } = otpData;

      const [
        updatePasswordData,
        updatePasswordError,
      ]: typeof UpdatePasswordCommand.returnType =
        await this.commandBus.execute(
          new UpdatePasswordCommand(user_id, password),
        );

      if (updatePasswordError) {
        return returnException(ResetPasswordHandler.name, updatePasswordError);
      }

      const { message } = updatePasswordData;

      this.eventBus.publish(new DeleteOtpEvent(otp));

      return [{ message }, null];
    } catch (error) {
      return returnException(ResetPasswordHandler.name, error);
    }
  }
}
