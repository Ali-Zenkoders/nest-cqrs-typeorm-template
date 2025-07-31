import { UserWeddingBudget } from '../enums/user-wedding-budget.enum';

export const BudgetRangeLabel: Record<UserWeddingBudget, string> = {
  [UserWeddingBudget.ZERO_TO_FIFTEEN_K]: 'Up to $15,000',
  [UserWeddingBudget.FIFTEEN_K_TO_THIRTY_K]: '$15,000 - $30,000',
  [UserWeddingBudget.THIRTY_K_TO_SIXTY_K]: '$30,000 - $60,000',
  [UserWeddingBudget.SIXTY_K_TO_HUNDRED_K]: '$60,000 - $100,000',
  [UserWeddingBudget.HUNDRED_K_PLUS]: 'More than $100,000',
};
