import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Request } from 'express';

export const PaginateQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PageOptionsDto => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const query = request.query;

    const withDefaultValues: PageOptionsDto = {
      ...new PageOptionsDto(),
      ...query,
    } as PageOptionsDto;

    return withDefaultValues;
  },
);
