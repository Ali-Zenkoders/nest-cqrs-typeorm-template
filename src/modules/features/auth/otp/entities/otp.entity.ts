import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OtpPurpose } from '../enums/otp-purpose.enum';
import { UserEntity } from 'src/modules/features/user/entities/user.entity';

@Entity({ name: 'otp' })
export class OtpEntity extends BaseEntity {
  @Column('enum', { enum: OtpPurpose, nullable: false })
  purpose: OtpPurpose;

  @Column('varchar', { length: 6, nullable: false })
  code: string;

  @Column('timestamptz', { nullable: false })
  expires_at: Date;

  @Column('uuid', { nullable: false })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.otps, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
