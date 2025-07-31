import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { OtpPurpose } from '../enums/otp-purpose.enum';

export class RequestOtpDto {
  @ApiProperty({
    name: 'email',
    type: String,
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    name: 'purpose',
    enum: OtpPurpose,
    example: OtpPurpose.FORGOT_PASSWORD,
  })
  @IsNotEmpty()
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}
