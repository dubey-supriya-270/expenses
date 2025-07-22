import express, { Request, Response, NextFunction } from "express";
import { User } from "../interfaces/user";
import { CustomError } from "../middlewares/error";
import STATUS from "../constants/status-code";
import * as userController from "../controllers/user";
import { Result } from "../interfaces/result";
import { hashString, validateHashedString } from "../helpers/bcrypt";
import { generateToken } from "../helpers/jwt";
import logger from "../utils/logger";

const router = express.Router();

router.post(
  "/sign-up",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, password, role } = req.body;

      // validate request body
      if (!userName || !password) {
        // Throw an error if any parameter is not provided
        const err: CustomError = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: `userName and password are required`,
        };

        throw err;
      }
     
      const finalRole = role ?? 'employee'
      // controller call to save user details
      const result: Result<User> = await userController.addUser(
        userName,hashString(password),  finalRole  
      );
      if (result.isError()) {
        throw result.error;
      }

      // generate jwt token
      const token = generateToken(result.data);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path   : '/',   
      });

      res.status(STATUS.OK).json({
        status: STATUS.OK,
        message: "Successfully registered user",
        userId: result.data?.id,
        role: finalRole, 
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/sign-in",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, password } = req.body;

      // validate request body
      if (!userName || !password) {
        // Throw an error if any parameter is not provided
        const err: CustomError = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: `userName and password are required`,
        };

        throw err;
      }

      // check if the user exists with the userName
      const isUserExists: Result<User> =
        await userController.fetchUserDetails(userName);
      if (isUserExists.isError()) {
        throw isUserExists.error;
      }

      // validate password
      const isPasswordValid: boolean = await validateHashedString(
        password,
        isUserExists.data?.password_hash!
      );

      if (!isPasswordValid) {
        // throw an error if entered password is invalid
        const err: CustomError = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: "Invalid password",
        };
        throw err;
      }

      // generate token
      const token = generateToken(isUserExists.data);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
        path   : '/',   
      });

      res.status(STATUS.OK).json({
        status: STATUS.OK,
        message: "Successfully logged in",
        role: isUserExists.data!.role, 
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;