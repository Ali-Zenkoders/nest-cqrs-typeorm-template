import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RegisterLocalUserCommand } from '../register-local-user.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../repositories/user.repository';
import { HttpStatus, Logger } from '@nestjs/common';
import { returnException } from 'src/utils/return-exception';
import { UserEntity } from '../../entities/user.entity';
import { genSalt, hash } from 'bcrypt';
import { AuthProvider } from 'src/common/enums';
import { UserRole } from '../../enums/user-role.enum';
import { SALT_ROUND } from 'src/common/constants';
import { UserDetailEntity } from '../../entities/user-detail.entity';
import { SendOtpEmailEvent } from '../../../auth/events/send-otp-email.event';
import { OtpPurpose } from 'src/modules/features/auth/otp/enums/otp-purpose.enum';

@CommandHandler(RegisterLocalUserCommand)
export class RegisterLocalUserHandler
  implements ICommandHandler<RegisterLocalUserCommand>
{
  private readonly logger = new Logger(RegisterLocalUserHandler.name);
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: RegisterLocalUserCommand,
  ): Promise<typeof RegisterLocalUserCommand.returnType> {
    const { name, email, isAgreed, password } = command;

    const user = await this.userRepo.findByEmail(email);

    if (user) {
      return returnException(
        RegisterLocalUserHandler.name,
        'User already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const salt = await genSalt(SALT_ROUND);
      const hashPassword = await hash(password, salt);

      const user = queryRunner.manager.create(UserEntity, {
        name,
        email,
        is_agreed: isAgreed,
        password: hashPassword,
        provider: AuthProvider.LOCAL,
        role: UserRole.USER,
      });

      await queryRunner.manager.save(user);

      const userDetail = queryRunner.manager.create(UserDetailEntity, {
        user_id: user.id,
      });

      await queryRunner.manager.save(userDetail);

      await queryRunner.commitTransaction();

      // Send verification email
      this.eventBus.publish(
        new SendOtpEmailEvent(user.id, name, email, OtpPurpose.VERIFICATION),
      );

      return [{ message: 'Verification email sent', userId: user.id }, null];
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      return returnException(RegisterLocalUserHandler.name, error);
    } finally {
      await queryRunner.release();
    }
  }
}
