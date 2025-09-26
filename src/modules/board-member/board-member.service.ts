import { Injectable } from '@nestjs/common';
import { BoardMemberRepository } from './board-member.repository';
import { UserEntity } from '../user/entities/user.entity';
import { BoardEntity } from '../board/entities/board.entity';
import { InviteUserDto } from './dto/invite-user.dto';
import { BoardMemberEntity } from './entities/board-member.entity';
import { BoardPageOptionsDto } from '../board/dto/board-page-options.dto';
import { PageDto } from '../../common/dto/page.dto';

@Injectable()
export class BoardMemberService {
  constructor(private boardMemberRepository: BoardMemberRepository) {}

  async addOwner(user: UserEntity, board: BoardEntity): Promise<void> {
    await this.boardMemberRepository.addOwner(user, board);
  }

  async addMembers(
    board: BoardEntity,
    invites: InviteUserDto[],
    users: UserEntity[],
  ): Promise<{
    added: BoardMemberEntity[];
    errors: { email: string; reason: string }[];
  }> {
    return await this.boardMemberRepository.addMembers(board, invites, users);
  }

  async findAllByBoard(
    boardId: string,
    ownerId: string,
    pageOptionsDto: BoardPageOptionsDto,
  ): Promise<PageDto<BoardMemberEntity>> {
    return await this.boardMemberRepository.findAllByBoard(
      boardId,
      ownerId,
      pageOptionsDto,
    );
  }

  async findUserRole(
    userId: string,
    boardId: string,
  ): Promise<BoardMemberEntity> {
    return await this.boardMemberRepository.findUserRole(userId, boardId);
  }

  async findOne(boardId: string, userId: string): Promise<BoardMemberEntity> {
    return await this.boardMemberRepository.findOne(boardId, userId);
  }

  async save(member: BoardMemberEntity): Promise<BoardMemberEntity> {
    return await this.boardMemberRepository.save(member);
  }

  async remove(member: BoardMemberEntity): Promise<void> {
    await this.boardMemberRepository.remove(member);
  }
}
