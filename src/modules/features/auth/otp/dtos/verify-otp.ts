import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { OtpPurpose } from '../enums/otp-purpose.enum';

export class VerifyOtpDto {
  @ApiProperty({
    name: 'code',
    type: String,
    example: '123456',
  })
  @IsNotEmpty()
  @IsNumberString()
  code: string;

  @ApiProperty({
    name: 'purpose',
    enum: OtpPurpose,
    example: OtpPurpose.FORGOT_PASSWORD,
  })
  @IsNotEmpty()
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}
