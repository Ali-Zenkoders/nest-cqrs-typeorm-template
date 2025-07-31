import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { LoginCommand } from '../login.command';
import { returnException } from 'src/utils/return-exception';
import { GetUserQuery } from '../../../user/queries/get-user.query';
import { SendOtpEmailEvent } from '../../events/send-otp-email.event';
import { compare } from 'bcrypt';
import { JwtPayload } from 'src/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserLoggedInEvent } from '../../../user/events/user-logged-in.event';
import { OtpPurpose } from '../../otp/enums/otp-purpose.enum';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_EXPIRES_IN'),
      },
    );

    return accessToken;
  }

  async execute(
    command: LoginCommand,
  ): Promise<typeof LoginCommand.returnType> {
    const { email, password, skipMatch } = command;

    try {
      const [userData, userError]: typeof GetUserQuery.returnType =
        await this.queryBus.execute(new GetUserQuery(undefined, email));

      if (userError) {
        return returnException(LoginHandler.name, userError);
      }

      const { id, email: userEmail, role, name } = userData;

      if (!userData.is_verified) {
        this.eventBus.publish(
          new SendOtpEmailEvent(id, name, userEmail, OtpPurpose.VERIFICATION),
        );

        return [
          {
            accessToken: null,
            isVerified: false,
            message: 'Verification email sent successfully',
            user: null,
          },
          null,
        ];
      }

      if (userData.google_id) {
        return returnException(
          LoginHandler.name,
          'This account is registered with google. Please sign in with google',
        );
      }

      if (!userData.password) {
        return returnException(LoginHandler.name, 'Password not set');
      }

      if (!skipMatch) {
        const isPasswordMatch = await compare(password, userData.password);

        if (!isPasswordMatch) {
          return returnException(LoginHandler.name, 'Invalid credentials');
        }
      }

      const accessToken = await this.generateAccessToken({
        id,
        email: userEmail,
        role,
      });

      this.eventBus.publish(new UserLoggedInEvent(id));

      return [
        {
          accessToken,
          message: 'Login successfully',
          isVerified: true,
          user: userData,
        },
        null,
      ];
    } catch (error) {
      return returnException(LoginHandler.name, error);
    }
  }
}
