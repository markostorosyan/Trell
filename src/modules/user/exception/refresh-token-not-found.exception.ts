import { NotFoundException } from '@nestjs/common';

export class RefreshTokenNotFoundException extends NotFoundException {
  constructor() {
    super('error.refreshTokenNotFound');
  }
}
