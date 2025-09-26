import { BadRequestException } from '@nestjs/common';

export class UserIdIsRequiredException extends BadRequestException {
  constructor() {
    super('error.userIdIsRequired');
  }
}
