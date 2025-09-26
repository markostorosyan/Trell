import { Injectable } from '@nestjs/common';
import { BoardService } from '../board/board.service';
import { BoardMemberService } from '../board-member/board-member.service';
import { UserService } from '../user/user.service';
import { InviteUserDto } from '../board-member/dto/invite-user.dto';
import { BoardMemberEntity } from '../board-member/entities/board-member.entity';
import { BoardMemberRole } from '../../constants/board-member-role.enum';

@Injectable()
export class MemberService {
  constructor(
    private boardService: BoardService,
    private boardMemberService: BoardMemberService,
    private userService: UserService,
  ) {}

  async addMembers(
    boardId: string,
    ownerId: string,
    invites: InviteUserDto[],
  ): Promise<{
    added: BoardMemberEntity[];
    errors: { email: string; reason: string }[];
  }> {
    const board = await this.boardService.checkBoardExistAndOwner(
      boardId,
      ownerId,
    );

    const userEmail = invites.map((i) => i.email);
    const users = await this.userService.findByIds(userEmail);

    return this.boardMemberService.addMembers(board, invites, users);
  }

  async getMember(boardId: string, userId: string): Promise<BoardMemberEntity> {
    return await this.boardMemberService.findOne(boardId, userId);
  }

  async updateMemberRole(
    boardId: string,
    ownerId: string,
    userId: string,
    role: BoardMemberRole,
  ): Promise<BoardMemberEntity> {
    await this.boardService.checkBoardExistAndOwner(boardId, ownerId);
    await this.userService.findById(userId);

    const member = await this.boardMemberService.findOne(boardId, userId);

    member.role = role;
    return this.boardMemberService.save(member);
  }

  async removeMember(
    boardId: string,
    ownerId: string,
    userId: string,
  ): Promise<void> {
    await this.boardService.checkBoardExistAndOwner(boardId, ownerId);
    await this.userService.findById(userId);

    const member = await this.boardMemberService.findOne(boardId, userId);

    await this.boardMemberService.remove(member);
  }
}
