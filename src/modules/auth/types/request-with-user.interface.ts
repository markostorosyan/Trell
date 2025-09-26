import { Request } from 'express';
import { PayloadDto } from '../dto/payload.dto';

export interface IRequestWithUser extends Request {
  user: PayloadDto;
}
