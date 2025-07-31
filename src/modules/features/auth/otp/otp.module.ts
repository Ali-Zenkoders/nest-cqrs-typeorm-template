import { Module } from '@nestjs/common';
import { OtpRepository } from './repositories/otp.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './entities/otp.entity';
import { CreateOtpHandler } from './commands/handlers/create-otp.handler';
import { GetOtpHandler } from './queries/handlers/get-otp.handler';
import { VerifyOtpHandler } from './commands/handlers/verify-otp.handler';
import { DeleteOtpHandler } from './events/handlers/delete-otp.handler';
import { RemoveExpireOtpScheduler } from './schedulers/remove-expire-otp.scheduler';
import { RequestOtpHandler } from './commands/handlers/request-otp.handler';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  providers: [
    OtpRepository,
    CreateOtpHandler,
    GetOtpHandler,
    VerifyOtpHandler,
    DeleteOtpHandler,
    RequestOtpHandler,
    RemoveExpireOtpScheduler,
  ],
  exports: [],
})
export class OtpModule {}
