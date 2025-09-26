import { registerDecorator, ValidationOptions } from 'class-validator';
import { BoardMemberRole } from '../../../constants/board-member-role.enum';

export function NotOwnerRole(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'notOwnerRole',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value !== BoardMemberRole.OWNER;
        },
        defaultMessage() {
          return 'Role OWNER is not allowed here';
        },
      },
    });
  };
}
