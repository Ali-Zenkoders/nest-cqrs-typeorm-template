import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
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
}
