import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const JWT_SECRET = process.env.JWT_SECRET

export const generateToken = (details: any, validUpto?: string) => {
  const options = validUpto ? { expiresIn: validUpto } : ({} as any);

  return jwt.sign(details, JWT_SECRET!, options);
};

export const verifyJWTToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);

    return decoded;
  } catch (error) {
    logger.error(`at: utils/jwt/verifyJWTToken => ${JSON.stringify(error)} \n ${error}.`);

    return false;
  }
};

/**
 * Decodes the JWT token without verifying its signature.
 * @param token - The JWT token to be decoded.
 * @returns The decoded payload of the JWT token.
 */
export const decodeJWTToken = (token: string): any => {
  return jwt.decode(token, { complete: true });
};
