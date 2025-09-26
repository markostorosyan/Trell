import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadDto } from '../dto/payload.dto';
import { IRequestWithUser } from '../types/request-with-user.interface';

export const User = createParamDecorator(
  (data: keyof PayloadDto | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<IRequestWithUser>();
    const user = request.user;
    return data ? user[data] : user;
  },
);
