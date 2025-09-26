import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from './entities/card.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ListEntity } from '../list/entities/list.entity';
import { CardNotFoundException } from './exception/card-not-found.exception';
import { paginate } from '../../common/types/paginate';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';

@Injectable()
export class CardRepository {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
  ) {}

  async create(
    list: ListEntity,
    user: UserEntity,
    createCardDto: CreateCardDto,
  ): Promise<CardEntity> {
    const cardEntity = this.cardRepository.create({
      ...createCardDto,
      list,
      createdBy: user,
    });

    await this.cardRepository.save(cardEntity);

    return cardEntity;
  }

  async findAll(
    listId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CardEntity>> {
    const queryBuilder = this.cardRepository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.list', 'list')
      .where('card.listId = :listId', { listId });

    return await paginate(queryBuilder, pageOptionsDto);
  }

  async findOne(id: string, join: boolean = false): Promise<CardEntity> {
    const queryBuilder = this.cardRepository
      .createQueryBuilder('card')
      .where('card.id = :id', { id });

    if (join) {
      queryBuilder
        .leftJoinAndSelect('card.createdBy', 'createdBy')
        .leftJoinAndSelect('card.updatedBy', 'updatedBy');
    }

    const cardEntity = await queryBuilder.getOne();

    if (!cardEntity) {
      throw new CardNotFoundException();
    }

    return cardEntity;
  }

  async update(
    id: string,
    user: UserEntity,
    updateCardDto: UpdateCardDto,
  ): Promise<CardEntity> {
    const cardEntity = await this.findOne(id);

    this.cardRepository.merge(cardEntity, {
      ...updateCardDto,
      updatedBy: user,
    });

    await this.cardRepository.save(cardEntity);

    return cardEntity;
  }

  async remove(id: string): Promise<void> {
    try {
      const cardEntity = await this.findOne(id);

      await this.cardRepository.remove(cardEntity);
    } catch (error) {
      console.log(error);
    }
  }
}
