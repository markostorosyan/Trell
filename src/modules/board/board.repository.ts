import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from './entities/board.entity';
import { Repository } from 'typeorm';
import { BoardNotFoundException } from './exception/board-not-found.exception';
import { DoNotHaveAccessException } from './exception/do-not-have-access.exception';
import { UserEntity } from '../user/entities/user.entity';
import { paginate } from '../../common/types/paginate';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(BoardEntity)
    private boardRepository: Repository<BoardEntity>,
  ) {}

  async create(
    createBoardDto: CreateBoardDto,
    owner: UserEntity,
  ): Promise<BoardEntity> {
    const boardEntity = this.boardRepository.create({
      name: createBoardDto.name,
      owner,
    });

    await this.boardRepository.save(boardEntity);

    return boardEntity;
  }

  async findAll(
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BoardEntity>> {
    const queryBuilder = this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.owner', 'owner')
      .leftJoinAndSelect('board.members', 'members')
      .leftJoinAndSelect('members.user', 'memberUser')
      .where('owner.id = :userId OR memberUser.id = :userId', { userId });

    const paginateBoards = await paginate(queryBuilder, pageOptionsDto);

    if (paginateBoards.data.length === 0) {
      throw new DoNotHaveAccessException();
    }

    return paginateBoards;
  }

  async findOne(id: string, userId: string): Promise<BoardEntity> {
    const boardEntity = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.owner', 'owner')
      .leftJoinAndSelect('board.members', 'members')
      .leftJoinAndSelect('members.user', 'users')
      .leftJoinAndSelect('board.lists', 'lists')
      .where('board.id = :id', { id })
      .getOne();

    if (!boardEntity) {
      throw new BoardNotFoundException();
    }

    const isOwner = boardEntity.owner.id === userId;
    const isMember = boardEntity.members.some((m) => m.user.id === userId);

    if (!isOwner && !isMember) {
      throw new DoNotHaveAccessException();
    }

    return boardEntity;
  }

  async checkBoardExistAndOwner(
    id: string,
    ownerId: string,
  ): Promise<BoardEntity> {
    const boardEntity = await this.boardRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!boardEntity) {
      throw new BoardNotFoundException();
    }

    if (boardEntity.owner.id !== ownerId) {
      throw new DoNotHaveAccessException();
    }

    return boardEntity;
  }

  async update(
    id: string,
    updateBoardDto: UpdateBoardDto,
    userId: string,
  ): Promise<BoardEntity> {
    const boardEntity = await this.checkBoardExistAndOwner(id, userId);

    this.boardRepository.merge(boardEntity, updateBoardDto);
    await this.boardRepository.save(boardEntity);

    return boardEntity;
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const boardEntity = await this.checkBoardExistAndOwner(id, userId);

      await this.boardRepository.remove(boardEntity);
    } catch (error) {
      console.log(error);
      throw new DoNotHaveAccessException();
    }
  }
}
