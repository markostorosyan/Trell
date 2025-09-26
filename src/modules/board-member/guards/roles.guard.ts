import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BoardMemberRole } from '../../../constants/board-member-role.enum';
import { Reflector } from '@nestjs/core';
import { BoardMemberService } from '../board-member.service';
import { BoardNotFoundException } from '../../board/exception/board-not-found.exception';
import { UserIsNotMemberException } from '../exception/user-is-not-member.exception';
import { YouDoNotHavePermissionException } from '../../auth/exception/you-do-not-have-permission.exception';
import { IRequestWithUser } from '../../../interfaces/requestWithBoard.interface';
import { ROLES_KEY } from '../../../common/decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private boardMemberService: BoardMemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<
      BoardMemberRole[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest<IRequestWithUser>();
    const { user } = request;

    if (requiredRoles !== undefined) {
      if (requiredRoles.length === 0) {
        return true;
      }

      const boardId = request.params.boardId;

      if (!boardId) {
        throw new BoardNotFoundException();
      }

      if (!user) {
        throw new YouDoNotHavePermissionException();
      }

      const userRoleOnBoard = await this.boardMemberService.findUserRole(
        user.id,
        boardId,
      );

      if (!userRoleOnBoard || !requiredRoles.includes(userRoleOnBoard.role)) {
        throw new UserIsNotMemberException();
      }
      return true;
    }
    return true;
  }
}
