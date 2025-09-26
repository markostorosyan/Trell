import * as bcrypt from 'bcrypt';
import { InvalidDataException } from './modules/auth/exception/invalid-password.exception';

export async function hashData(data: string): Promise<string> {
  const hash = await bcrypt.hash(data, 10);

  return hash;
}

export async function compareData(
  data: string,
  hashedData: string,
  type: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(data, hashedData);

  if (!isMatch) {
    throw new InvalidDataException(type);
  }

  return true;
}
