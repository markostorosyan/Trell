import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyTakenException extends BadRequestException {
  constructor() {
    super(
      'error.This email is already taken. Please try a different one or log in',
    );
  }
}
