import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SignUpDto } from '../dtos/sign-up.dto';
import { RegisterLocalUserCommand } from '../../user/commands/register-local-user.command';
import { LoginDto } from '../dtos/login.dto';
import { LoginCommand } from '../commands/login.command';
import { VerifyOtpDto } from '../otp/dtos/verify-otp';
import { VerifyOtpCommand } from '../otp/commands/verify-otp.command';
import { RequestOtpCommand } from '../otp/commands/request-otp.command';
import { RequestOtpDto } from '../otp/dtos/request-otp';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ResetPasswordCommand } from '../commands/reset-password.command';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'Verification email sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or user already exists',
  })
  @ApiBody({ type: SignUpDto })
  @ResponseMessage(
    'A verification email has been sent to your registered email address.',
  )
  async signUp(@Body() body: SignUpDto) {
    const { name, email, isAgreed, password } = body;
    const [data, error]: typeof RegisterLocalUserCommand.returnType =
      await this.commandBus.execute(
        new RegisterLocalUserCommand(name, email, password, isAgreed),
      );

    return error ?? data;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        success: true,
        message: 'Login successfully',
        data: {
          accessToken: 'jwt-token',
          isVerified: true,
          user: {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'USER',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or unverified email',
  })
  @ApiBody({ type: LoginDto })
  @ResponseMessage('Login successfully')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const [data, error]: typeof LoginCommand.returnType =
      await this.commandBus.execute(new LoginCommand(email, password));

    return error ?? data;
  }

  @ApiOperation({
    summary: 'Verify an OTP for email verification or password reset',
  })
  @ApiResponse({
    status: 200,
    description:
      'OTP verified successfully. If for VERIFICATION, user is returned with access token.',
    schema: {
      example: {
        message: 'OTP verified. You can now reset your password.',
        isVerified: true,
        accessToken: null,
        user: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired OTP',
  })
  @ApiResponse({
    status: 500,
    description: 'Server error while verifying OTP',
  })
  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const { code, purpose } = body;
    const [data, error]: typeof VerifyOtpCommand.returnType =
      await this.commandBus.execute(new VerifyOtpCommand(code, purpose));

    return error ?? data;
  }

  @Post('request-otp')
  @ApiOperation({
    summary: 'Request OTP for account verification or password reset',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - invalid email or purpose',
  })
  @ApiBody({ type: RequestOtpDto })
  async requestOtp(@Body() body: RequestOtpDto) {
    const { email, purpose } = body;
    const [data, error]: typeof RequestOtpCommand.returnType =
      await this.commandBus.execute(new RequestOtpCommand(email, purpose));

    return error ?? data;
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset user password using OTP',
    description:
      'Verifies the OTP for forgot password purpose and updates the user password.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or failure during password update.',
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { otp, password } = body;
    const [data, error]: typeof ResetPasswordCommand.returnType =
      await this.commandBus.execute(new ResetPasswordCommand(otp, password));

    return error ?? data;
  }
}
