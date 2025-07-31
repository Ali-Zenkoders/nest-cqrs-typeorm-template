import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDetailEntity } from './entities/user-detail.entity';
import { RegisterLocalUserHandler } from './commands/handlers/register-local-user.handler';
import { UserRepository } from './repositories/user.repository';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { MarkUserAsVerifiedHandler } from './commands/handlers/mark-user-as-verified.handler';
import { UserLoggedInHandler } from './events/handlers/user-logged-in.handler';
import { UpdatePasswordHandler } from './commands/handlers/update-password.handler';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserDetailEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RegisterLocalUserHandler,
    GetUserHandler,
    MarkUserAsVerifiedHandler,
    UserLoggedInHandler,
    UpdatePasswordHandler,
  ],
})
export class UserModule {}
