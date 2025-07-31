import { IsNull, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../enums/user-role.enum';

export class UserRepository extends Repository<UserEntity> {
  constructor(@InjectRepository(UserEntity) userRepo: Repository<UserEntity>) {
    super(userRepo.target, userRepo.manager, userRepo.queryRunner);
  }

  async findById(id: string) {
    return await this.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });
  }

  async findByEmail(email: string) {
    return await this.findOne({
      where: {
        email,
        deleted_at: IsNull(),
      },
    });
  }

  async findByRole(role: UserRole) {
    return await this.findOne({
      where: {
        role,
        deleted_at: IsNull(),
      },
    });
  }

  async updateLastLogin(id: string) {
    return await this.update({ id }, { last_login: new Date() });
  }
}
