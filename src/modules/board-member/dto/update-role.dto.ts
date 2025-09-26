import { IsEnum } from 'class-validator';
import { BoardMemberRole } from '../../../constants/board-member-role.enum';
import { NotOwnerRole } from '../decorator/not-owner-role.decorator';

export class UpdateRoleDto {
  @IsEnum(BoardMemberRole)
  @NotOwnerRole({ message: 'You cannot assign the OWNER role' })
  role: BoardMemberRole;
}
