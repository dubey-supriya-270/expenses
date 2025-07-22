import { Router, Request, Response, NextFunction } from 'express';
import {
  createExpense,
  listExpenses,
  approveExpense,
  getAnalytics,
} from '../controllers/expense';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import STATUS from '../constants/status-code';

const router = Router();

// Create Expense (all authenticated)
router.post(
  '/',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.userId!;
      const { amount, category, description, date } = req.body;
      const result = await createExpense({ user_id, amount, category, description, date });
      if (result.isError()) throw result.error;
      res.status(STATUS.OK).json({
        status: STATUS.OK,
        success: true,
        message: 'Successfully Created Expense.',
      });
    } catch (error) {
      next(error);
    }
  }
);

// List Expenses (employees see own, admin sees all)
router.get(
  '/',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page     = Number(req.query.page  ?? 1);
      const limit    = Number(req.query.limit ?? 10);
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : undefined;
      const dateTo   = typeof req.query.dateTo   === 'string' ? req.query.dateTo   : undefined;

      const result = await listExpenses(
        { userId: req.user.id, role: req.user.role },
        { page, limit, category, dateFrom, dateTo }
      );

      if (result.isError()) throw result.error;

      res.status(STATUS.OK).json({
        status : STATUS.OK,
        success: true,
        data   : result.data!.rows,
        total  : result.data!.total,
        page,
        limit,
      });
    } catch (error) { next(error); }
  }
);

// Approve Expense (admin only)
router.put(
  '/:id/approve',
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await approveExpense(Number(req.params.id));
      if (result.isError()) throw result.error;
      res.status(STATUS.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }
);

// Analytics (all authenticated)
router.get(
  '/analytics',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAnalytics();
      if (result.isError()) throw result.error;
      res.status(STATUS.OK).json({
        status: STATUS.OK,
        success: true,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;