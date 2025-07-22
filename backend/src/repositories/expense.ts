import { knexInstance } from "../db/db";
import { Expense, Filter } from "../interfaces/expense";
import logger from "../utils/logger";
import { Result } from "../interfaces/result";
import { getFromCache, setToCache, removeFromCache } from "../utils/redis";
import { Knex } from "knex";

const ANALYTICS_KEY = "expense_analytics";

export const createUserExpense = async (
  data: Omit<Expense, "id" | "approved" | "created_at">
): Promise<Result<Expense>> => {
  try {
    logger.debug(`Creating expense for user ${data.user_id}`);
    const [expense] = await knexInstance("expenses")
      .insert({ ...data, approved: false })
      .returning("id");
    logger.info(`Expense created: ${expense.id}`);
    await removeFromCache(ANALYTICS_KEY);
    return Result.ok();
  } catch (error: any) {
    logger.error(`createUserExpense error: ${error.message}`, error);
    return Result.error({ customMessage: "Failed to create expense." });
  }
};


export async function listAllExpenses(
  offset = 0,
  limit = 10,
  filter: Filter = {}
): Promise<Result<{ rows: Expense[]; total: number }>> {
  try {
    const q = knexInstance('expenses').modify(buildFilters, filter);

    const countRows:any = await q.clone().count<{ count: string }>('id'); // ← fix
    const total     = Number(countRows[0].count);
    const rows = await q
      .clone()
      .orderBy('date', 'desc')
      .offset(offset)
      .limit(limit);

    return Result.ok({ rows, total: total });
  } catch (e: any) {
    return Result.error(e.message);
  }
}

export async function listExpensesByUser(
  userId: number,
  offset = 0,
  limit = 10,
  filter: Filter = {}
) {
  return listAllExpenses(offset, limit, { ...filter, userId });
}

/* shared WHERE-builder */
function buildFilters(q: Knex.QueryBuilder, f: Filter) {
  if (f.userId)   q.where('user_id', f.userId);
  if (f.category) q.where('category', f.category);
  if (f.dateFrom) q.where('date', '>=', f.dateFrom);
  if (f.dateTo)   q.where('date', '<=', f.dateTo);
}


export const approveUserExpense = async (id: number): Promise<Result<null>> => {
  try {
    logger.debug(`Approving expense ${id}`);
    await knexInstance("expenses").where({ id }).update({ approved: true });
    await removeFromCache(ANALYTICS_KEY);
    return Result.ok(null);
  } catch (error: any) {
    logger.error(`approveUserExpense error: ${error.message}`, error);
    return Result.error({ customMessage: "Failed to approve expense." });
  }
};

export const getExpensesAnalytics = async (): Promise<Result<Expense[]>> => {
  try {
    const cached = await getFromCache(ANALYTICS_KEY);
    if (cached.isOk()) {
      logger.info("Analytics cache hit");
      return Result.ok(JSON.parse(cached.data!));
    }

    logger.info("Analytics cache miss, fetching approved expenses");

    const approvedExpenses: Expense[] = await knexInstance("expenses").where({ approved: true });

    await setToCache(ANALYTICS_KEY, JSON.stringify(approvedExpenses));

    return Result.ok(approvedExpenses);
  } catch (error: any) {
    logger.error(`getExpensesAnalytics error: ${error.message}`, error);
    return Result.error({ customMessage: "Failed to fetch analytics." });
  }
};

