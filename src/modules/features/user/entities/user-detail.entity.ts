import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserOnboardStatus } from '../enums/user-onboard-status.enum';
import { UserWeddingStyle } from '../enums/user-wedding-style.enum';
import { UserInvitationGuests } from '../enums/user-invitation-guests.enum';
import { UserWeddingBudget } from '../enums/user-wedding-budget.enum';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_detail' })
export class UserDetailEntity extends BaseEntity {
  @Column('enum', {
    enum: UserOnboardStatus,
    default: UserOnboardStatus.WEDDING_STYLE,
  })
  onboard_status: UserOnboardStatus;

  @Column('enum', { enum: UserWeddingStyle, nullable: true })
  wedding_style: UserWeddingStyle | null;

  @Column('enum', { enum: UserInvitationGuests, nullable: true })
  invitation_guests: UserInvitationGuests | null;

  @Column('date', { nullable: true })
  wedding_date: Date | null;

  @Column('text', { nullable: true })
  wedding_location: string | null;

  @Column('enum', { enum: UserWeddingBudget, nullable: true })
  wedding_budget: UserWeddingBudget | null;

  @Column('boolean', { default: false })
  onboarding_complete: boolean;

  @Column('uuid', { nullable: true })
  user_id: string;

  @OneToOne(() => UserEntity, (user) => user.user_detail, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
