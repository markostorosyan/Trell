import { NotFoundException } from '@nestjs/common';

export class CardNotFoundException extends NotFoundException {
  constructor() {
    super('error.cardNotFound');
  }
}
