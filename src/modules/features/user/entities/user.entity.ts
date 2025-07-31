import { BaseEntity } from 'src/common/entities/base.entity';
import { AuthProvider } from 'src/common/enums';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { OtpEntity } from '../../auth/otp/entities/otp.entity';
import { UserDetailEntity } from './user-detail.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column('varchar', { length: 255, nullable: true })
  google_id: string | null;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Column('varchar', { length: 255, unique: true, nullable: false })
  email: string;

  @Column('enum', { enum: AuthProvider, nullable: false })
  provider: AuthProvider;

  @Column('enum', { enum: UserRole, nullable: false })
  role: UserRole;

  @Column('varchar', { length: 255, nullable: true })
  password: string | null;

  @Column('boolean', { nullable: false })
  is_agreed: boolean;

  @Column('enum', { enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus; // active banned

  @Column('boolean', { default: false })
  is_verified: boolean;

  @Column('timestamptz', { nullable: true })
  last_login: Date | null;

  @OneToOne(() => UserDetailEntity, (userDetail) => userDetail.user)
  user_detail: UserDetailEntity;

  // TODO: add vendor detail entity

  @OneToMany(() => OtpEntity, (otp) => otp.user)
  otps: OtpEntity[];
}
