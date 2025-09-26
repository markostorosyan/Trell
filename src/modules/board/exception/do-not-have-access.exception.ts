import { ForbiddenException } from '@nestjs/common';

export class DoNotHaveAccessException extends ForbiddenException {
  constructor() {
    super('error.doNotHaveAccess');
  }
}
