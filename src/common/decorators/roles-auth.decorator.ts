import { applyDecorators, UseGuards } from '@nestjs/common';
import { BoardMemberRole } from '../../constants/board-member-role.enum';
import { Roles } from './role.decorator';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/board-member/guards/roles.guard';

export function RolesAuth(...roles: BoardMemberRole[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
}
