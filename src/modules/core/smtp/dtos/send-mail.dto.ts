import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Address } from 'nodemailer/lib/mailer';

export class SendMailDto {
  @IsOptional()
  @ValidateNested()
  from?: Address;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  recipients: Address[];

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  html: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsObject()
  placeholderReplacement?: Record<string, string>;
}
