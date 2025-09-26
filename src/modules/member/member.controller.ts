import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { User } from '../auth/decorator/user.decorator';
import { InviteUsersDto } from '../board-member/dto/invite-user.dto';
import { BoardMemberEntity } from '../board-member/entities/board-member.entity';
import { UpdateRoleDto } from '../board-member/dto/update-role.dto';
import { BoardMemberRole } from '../../constants/board-member-role.enum';
import { RolesAuth } from '../../common/decorators/roles-auth.decorator';

@Controller('boards/:boardId/members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post()
  @RolesAuth(BoardMemberRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  async addMembers(
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @User('id') userId: string,
    @Body() dto: InviteUsersDto,
  ): Promise<{
    added: BoardMemberEntity[];
    errors: { email: string; reason: string }[];
  }> {
    return await this.memberService.addMembers(boardId, userId, dto.users);
  }

  @Patch(':userId')
  @RolesAuth(BoardMemberRole.OWNER)
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @User('id') ownerId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.memberService.updateMemberRole(
      boardId,
      ownerId,
      userId,
      updateRoleDto.role,
    );
  }

  @Delete(':userId')
  @RolesAuth(BoardMemberRole.OWNER)
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @User('id') ownerId: string,
  ) {
    return await this.memberService.removeMember(boardId, ownerId, userId);
  }
}
