import { RangeTuple } from 'src/common/types';
import { UserWeddingBudget } from '../enums/user-wedding-budget.enum';

export const BudgetRangeMap: Record<UserWeddingBudget, RangeTuple> = {
  [UserWeddingBudget.ZERO_TO_FIFTEEN_K]: [0, 15_000],
  [UserWeddingBudget.FIFTEEN_K_TO_THIRTY_K]: [15_000, 30_000],
  [UserWeddingBudget.THIRTY_K_TO_SIXTY_K]: [30_000, 60_000],
  [UserWeddingBudget.SIXTY_K_TO_HUNDRED_K]: [60_000, 100_000],
  [UserWeddingBudget.HUNDRED_K_PLUS]: [100_000, Infinity],
};
