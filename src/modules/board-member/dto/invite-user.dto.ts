import {
  IsArray,
  ValidateNested,
  IsUUID,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BoardMemberRole } from '../../../constants/board-member-role.enum';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsEnum(BoardMemberRole)
  role: BoardMemberRole;
}

export class InviteUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InviteUserDto)
  users: InviteUserDto[];
}
