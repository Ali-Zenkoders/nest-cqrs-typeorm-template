import { RangeTuple } from 'src/common/types';
import { UserInvitationGuests } from '../enums/user-invitation-guests.enum';

export const GuestRangeMap: Record<UserInvitationGuests, RangeTuple> = {
  [UserInvitationGuests.ONE_TO_FIFTY]: [1, 50],
  [UserInvitationGuests.FIFTY_TO_HUNDRED]: [50, 100],
  [UserInvitationGuests.ONE_HUNDRED_TO_TWO_HUNDRED]: [100, 200],
  [UserInvitationGuests.TWO_HUNDRED_PLUS]: [200, Infinity],
};
