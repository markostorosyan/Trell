import { SetMetadata } from '@nestjs/common';
import { BoardMemberRole } from '../../constants/board-member-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: BoardMemberRole[]) =>
  SetMetadata(ROLES_KEY, roles);
