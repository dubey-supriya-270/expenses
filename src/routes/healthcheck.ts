import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";

const router = express.Router();

/**
 * @route healthcheck
 * @description
 * - @returns server running confirmation
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // return success response
    res.status(STATUS.OK).json({
      status: STATUS.OK,
      success: true,
      message: "service is up and running.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
