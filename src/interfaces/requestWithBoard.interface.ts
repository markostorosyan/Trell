import { Request } from 'express';
import { PayloadDto } from '../modules/auth/dto/payload.dto';

export interface IRequestWithUser extends Request {
  user: PayloadDto;
}
