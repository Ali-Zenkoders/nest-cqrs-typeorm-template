import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { VerifyOtpCommand } from '../verify-otp.command';
import { returnException } from 'src/utils/return-exception';
import { Result } from 'src/common/types';
import { UserEntity } from '../../../../user/entities/user.entity';
import { GetOtpQuery } from '../../queries/get-otp.query';
import { OtpPurpose } from '../../enums/otp-purpose.enum';
import { MarkUserAsVerifiedCommand } from '../../../../user/commands/mark-user-as-verified.command';
import { LoginCommand } from '../../../commands/login.command';
import { DeleteOtpEvent } from '../../events/delete-otp.event';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: VerifyOtpCommand): Promise<
    Result<{
      message: string;
      accessToken: string | null;
      isVerified: boolean;
      user: UserEntity | null;
    }>
  > {
    const { code, purpose } = command;
    try {
      const [otpData, otpError]: typeof GetOtpQuery.returnType =
        await this.queryBus.execute(new GetOtpQuery(code, purpose));

      if (otpError) {
        return returnException(VerifyOtpHandler.name, otpError);
      }

      if (otpData.purpose === OtpPurpose.FORGOT_PASSWORD) {
        return [
          {
            accessToken: null,
            isVerified: true,
            message: 'OTP verified. You can now reset your password.',
            user: null,
          },
          null,
        ];
      } else if (otpData.purpose === OtpPurpose.VERIFICATION) {
        const [
          userData,
          userError,
        ]: typeof MarkUserAsVerifiedCommand.returnType =
          await this.commandBus.execute(
            new MarkUserAsVerifiedCommand(otpData.user_id),
          );

        if (userError) {
          return returnException(VerifyOtpHandler.name, userError);
        }

        const { email, password } = userData;

        const [loginData, loginError]: typeof LoginCommand.returnType =
          await this.commandBus.execute(
            new LoginCommand(email, password!, true),
          );

        if (loginError) {
          return returnException(VerifyOtpHandler.name, loginError);
        }

        // Remove otp
        this.eventBus.publish(new DeleteOtpEvent(code));

        return [loginData, null];
      } else {
        return returnException(VerifyOtpHandler.name, 'Unable to verify otp');
      }
    } catch (error) {
      return returnException(VerifyOtpHandler.name, error);
    }
  }
}
