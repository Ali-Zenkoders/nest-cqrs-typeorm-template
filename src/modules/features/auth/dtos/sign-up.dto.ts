import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class SignUpDto {
  @ApiProperty({
    name: 'name',
    type: String,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'email',
    type: String,
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Invalid email address' })
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  email: string;

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

  @ApiProperty({
    name: 'isAgreed',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Equals(true, { message: 'You must agree to the terms' })
  isAgreed: boolean;
}
