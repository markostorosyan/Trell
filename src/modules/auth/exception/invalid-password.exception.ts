import { BadRequestException } from '@nestjs/common';

export class InvalidDataException extends BadRequestException {
  constructor(private type) {
    super(`error.invalid${type}`);
  }
}
