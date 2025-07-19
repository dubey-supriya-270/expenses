import { approveUserExpense, createUserExpense, getExpensesAnalytics, listAllExpenses, listExpensesByUser } from '../repositories/expense';
import { Expense, Filter, IExpenseCreate } from '../interfaces/expense';
import { Result } from '../interfaces/result';
import logger from '../utils/logger';

export async function createExpense(expenseData:IExpenseCreate) :Promise<Result>{
  try {
    const exp = await createUserExpense(expenseData);

    if (exp.isError()) {
      throw exp.error;
    }

    return Result.ok();
  } catch (error) { logger.error(`at: "controllers/expense/createExpense" => ${JSON.stringify(error)} \n ${error}.`);

  return Result.error(error); }
}

/**
   * List expenses for a given user.
   * @param userId - ID of the user
   */
export async function listExpenses(
  caller: { userId: number; role: 'admin'|'employee' },
  filter: Filter & { page: number; limit: number }
): Promise<Result<{ rows: Expense[]; total: number }>> {
  try {
    const { page, limit, ...rest } = filter;
    const offset = (page - 1) * limit;

    const r = await (caller.role === 'admin'
      ? listAllExpenses(offset, limit, rest)
      : listExpensesByUser(caller.userId, offset, limit, rest)
    );

    return r.isError() ? r : Result.ok(r.data);
  } catch (e) {
    logger.error('listExpenses', e);
    return Result.error({ customMessage: 'Unexpected error listing expenses.' });
  }
}

export async function  approveExpense(
  id: number
): Promise<Result<null>> {
  try {
    const result = await approveUserExpense(id);
    if (result.isError()) {
      logger.error(`ExpenseController#approveExpense error: ${result.error}`);
      return result;
    }
    return Result.ok();
  } catch (error: any) {
    logger.error(`ExpenseController#approveExpense unexpected error: ${error.message}`, error);
    return Result.error({ customMessage: 'Unexpected error approving expense.' });
  }
}

export async function getAnalytics(): Promise<Result<Record<string, number>>> {
  try {
    const result = await getExpensesAnalytics();
    if (result.isError()) {
      logger.error(`ExpenseController#getAnalytics error: ${result.error}`);
      return result;
    }
    return Result.ok(result.data);
  } catch (error: any) {
    logger.error(`ExpenseController#getAnalytics unexpected error: ${error.message}`, error);
    return Result.error({ customMessage: 'Unexpected error fetching analytics.' });
  }
}