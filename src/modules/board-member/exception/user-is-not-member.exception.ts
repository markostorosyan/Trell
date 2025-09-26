import { NotFoundException } from '@nestjs/common';

export class UserIsNotMemberException extends NotFoundException {
  constructor() {
    super('error.userIsNotMemberOfThisBoard');
  }
}
