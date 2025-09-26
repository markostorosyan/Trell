import { NotFoundException } from '@nestjs/common';

export class ListNotFoundException extends NotFoundException {
  constructor() {
    super('error.listNotFound');
  }
}
