import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { OtpModule } from './otp/otp.module';
import { SendOtpEmailHandler } from './events/handlers/send-otp-email.handler';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoginHandler } from './commands/handlers/login.handler';
import { PassportModule } from '@nestjs/passport';
import { ResetPasswordHandler } from './commands/handlers/reset-password.handler';

@Module({
  imports: [JwtModule.register({}), PassportModule, OtpModule],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthService,
    SendOtpEmailHandler,
    LoginHandler,
    ResetPasswordHandler,
  ],
})
export class AuthModule {}
