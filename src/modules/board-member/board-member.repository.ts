import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardMemberEntity } from './entities/board-member.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { BoardMemberRole } from '../../constants/board-member-role.enum';
import { BoardEntity } from '../board/entities/board.entity';
import { InviteUserDto } from './dto/invite-user.dto';
import { UserIsNotMemberException } from './exception/user-is-not-member.exception';
import { BoardPageOptionsDto } from '../board/dto/board-page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { BoardNotFoundException } from '../board/exception/board-not-found.exception';
import { DoNotHaveAccessException } from '../board/exception/do-not-have-access.exception';
import { paginate } from '../../common/types/paginate';

@Injectable()
export class BoardMemberRepository {
  constructor(
    @InjectRepository(BoardMemberEntity)
    private boardMemberRepository: Repository<BoardMemberEntity>,
  ) {}

  async addOwner(user: UserEntity, board: BoardEntity): Promise<void> {
    try {
      const boardMemberEntity = this.boardMemberRepository.create({
        role: BoardMemberRole.OWNER,
        user,
        board,
      });

      await this.boardMemberRepository.save(boardMemberEntity);
    } catch (error) {
      console.log(error);
    }
  }

  async addMembers(
    board: BoardEntity,
    invites: InviteUserDto[],
    users: UserEntity[],
  ): Promise<{
    added: BoardMemberEntity[];
    errors: { email: string; reason: string }[];
  }> {
    const membersToAdd: BoardMemberEntity[] = [];
    const errors: { email: string; reason: string }[] = [];

    for (const invite of invites) {
      const user = users.find((u) => u.email === invite.email);

      if (!user) {
        errors.push({ email: invite.email, reason: 'User not found' });
        continue;
      }

      const exists = await this.boardMemberRepository.findOne({
        where: { board: { id: board.id }, user: { id: user.id } },
      });

      if (exists) {
        errors.push({ email: invite.email, reason: 'Already a member' });
        continue;
      }

      membersToAdd.push(
        this.boardMemberRepository.create({
          board,
          user,
          role: invite.role,
        }),
      );
    }

    const added = await this.boardMemberRepository.save(membersToAdd);

    return { added, errors };
  }

  async findUserRole(
    userId: string,
    boardId: string,
  ): Promise<BoardMemberEntity> {
    return await this.boardMemberRepository.findOne({
      where: { board: { id: boardId }, user: { id: userId } },
      relations: ['user', 'board'],
    });
  }

  async findOne(boardId: string, userId: string): Promise<BoardMemberEntity> {
    const boardMemberEntity = await this.boardMemberRepository.findOne({
      where: { board: { id: boardId }, user: { id: userId } },
      relations: ['board', 'user'],
    });

    if (boardMemberEntity.user.id !== userId) {
      throw new UserIsNotMemberException();
    }

    return boardMemberEntity;
  }

  async findAllByBoard(
    boardId: string,
    ownerId: string,
    pageOptionsDto: BoardPageOptionsDto,
  ): Promise<PageDto<BoardMemberEntity>> {
    const boardWithOwner = await this.boardMemberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.board', 'board')
      .leftJoinAndSelect('board.owner', 'owner')
      .where('board.id = :boardId', { boardId })
      .getOne();

    if (!boardWithOwner) {
      throw new BoardNotFoundException();
    }
    if (boardWithOwner.board.owner.id !== ownerId) {
      throw new DoNotHaveAccessException();
    }

    const queryBuilder = this.boardMemberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.boardId = :boardId', { boardId });

    if (pageOptionsDto.role) {
      const normalizedRole =
        pageOptionsDto.role.toUpperCase() as BoardMemberRole;

      queryBuilder.andWhere('member.role = :role', {
        role: normalizedRole,
      });
    }

    return await paginate(queryBuilder, pageOptionsDto);
  }

  async save(member: BoardMemberEntity): Promise<BoardMemberEntity> {
    return await this.boardMemberRepository.save(member);
  }

  async remove(member: BoardMemberEntity): Promise<void> {
    await this.boardMemberRepository.remove(member);
  }
}
