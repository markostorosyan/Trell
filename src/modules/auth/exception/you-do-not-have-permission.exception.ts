import { ForbiddenException } from '@nestjs/common';

export class YouDoNotHavePermissionException extends ForbiddenException {
  constructor() {
    super('error.youDoNotHavePermission');
  }
}
