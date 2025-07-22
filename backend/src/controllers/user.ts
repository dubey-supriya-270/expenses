import { User } from '../interfaces/user';
import { Result } from '../interfaces/result';
import { createUser, findUserByUsername } from '../repositories/user';
import logger from '../utils/logger';

export const addUser = async ( userName: string,
  passwordHash: string,
  role: User['role']) => {
  try {

    const isUserExists: Result<User | any> =
      await findUserByUsername(userName);

    if (isUserExists?.data) {
      return Result.error("User already exists with this userName");
    }

    const addUserResult: Result = await createUser(userName, passwordHash, role);

    if (addUserResult.isError()) {
      throw addUserResult.error;
    }

    return Result.ok(addUserResult.data);
  } catch (error) {
    return Result.error(error);
  }
};

export const fetchUserDetails = async (userName: string) => {
  try {
    // To check whether user exists with this userName
    const isUserExists: Result<User | null> =
      await findUserByUsername(userName);

    if (isUserExists.isError()) {
      throw isUserExists.error;
    }

    // If userName doesn't exist throw an error
    if (!isUserExists.data) {
      return Result.error("User Name doesn't exist!");
    }

    // return user details if exists
    return Result.ok(isUserExists.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/users/fetchUserDetails" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    // return negative response
    return Result.error("Error fetching user details");
  }
};