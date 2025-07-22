import { knexInstance } from '../db/db';
import { User } from '../interfaces/user';
import logger from '../utils/logger';
import { Result } from '../interfaces/result';

export const createUser = async (
  username: string,
  passwordHash: string,
  role: User['role']
): Promise<Result<User>> => {
  try {
    logger.debug(`Creating user ${username}`);
    const [user] = await knexInstance('users')
      .insert({ username, password_hash: passwordHash, role })
      .returning('*');
    logger.info(`User created: ${user.id}`);
    return Result.ok(user);
  } catch (error: any) {
    logger.error(`createUser error: ${error.message}`, error);
    return Result.error({ customMessage: 'Failed to create user.' });
  }
};

export const findUserByUsername = async (
  username: string
): Promise<Result<User | null>> => {
  try {
    const user = await knexInstance('users').where({ username }).first();

    return Result.ok(user || null);
  } catch (error: any) {
    logger.error(`findUserByUsername error: ${error.message}`, error);
    return Result.error({ customMessage: 'Failed to find user.' });
  }
};