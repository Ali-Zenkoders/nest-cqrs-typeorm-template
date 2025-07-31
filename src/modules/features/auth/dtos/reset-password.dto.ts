import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class ResetPasswordDto {
  @ApiProperty({
    name: 'otp',
    type: String,
    example: '323221',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({
    name: 'password',
    type: String,
    example: 'Pa$$w0rd!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    name: 'confirmPassword',
    type: String,
    example: 'Pa$$w0rd!',
  })
  @IsNotEmpty()
  @IsString()
  @Match('password')
  confirmPassword: string;
}
