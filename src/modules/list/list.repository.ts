import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListEntity } from './entities/list.entity';
import { Repository } from 'typeorm';
import { BoardEntity } from '../board/entities/board.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ListNotFoundException } from './exception/list-not-found.exception';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { paginate } from '../../common/types/paginate';

@Injectable()
export class ListRepository {
  constructor(
    @InjectRepository(ListEntity)
    private listRepository: Repository<ListEntity>,
  ) {}

  async create(
    board: BoardEntity,
    user: UserEntity,
    createListDto: CreateListDto,
  ): Promise<ListEntity> {
    const listEntity = this.listRepository.create({
      ...createListDto,
      board,
      createdBy: user,
    });

    await this.listRepository.save(listEntity);

    return listEntity;
  }

  async findAll(
    boardId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ListEntity>> {
    const queryBuilder = this.listRepository
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.board', 'board')
      .where('list.boardId = :boardId', { boardId });

    return await paginate(queryBuilder, pageOptionsDto);
  }

  async findOne(id: string, join: boolean = false): Promise<ListEntity> {
    const queryBuilder = this.listRepository
      .createQueryBuilder('list')
      .where('list.id = :id', { id });

    if (join) {
      queryBuilder
        .leftJoinAndSelect('list.createdBy', 'createdBy')
        .leftJoinAndSelect('list.updatedBy', 'updatedBy');
    }

    const listEntity = await queryBuilder.getOne();

    if (!listEntity) {
      throw new ListNotFoundException();
    }

    return listEntity;
  }

  async update(
    id: string,
    user: UserEntity,
    updateListDto: UpdateListDto,
  ): Promise<ListEntity> {
    const listEntity = await this.findOne(id);

    this.listRepository.merge(listEntity, {
      ...updateListDto,
      updatedBy: user,
    });

    await this.listRepository.save(listEntity);

    return listEntity;
  }

  async remove(id: string): Promise<void> {
    try {
      const listEntity = await this.findOne(id);

      await this.listRepository.remove(listEntity);
    } catch (error) {
      console.log(error);
    }
  }
}
