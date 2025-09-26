import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardRepository } from './card.repository';
import { UserService } from '../user/user.service';
import { CardEntity } from './entities/card.entity';
import { ListService } from '../list/list.service';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';

@Injectable()
export class CardService {
  constructor(
    private cardRepository: CardRepository,
    private userService: UserService,
    private listService: ListService,
  ) {}

  async create(
    listId: string,
    userId: string,
    createCardDto: CreateCardDto,
  ): Promise<CardEntity> {
    const user = await this.userService.findById(userId);
    const list = await this.listService.findOne(listId, false);
    return await this.cardRepository.create(list, user, createCardDto);
  }

  async findAll(
    listId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CardEntity>> {
    return await this.cardRepository.findAll(listId, pageOptionsDto);
  }

  async findOne(id: string, join: boolean = false): Promise<CardEntity> {
    return await this.cardRepository.findOne(id, join);
  }

  async update(
    id: string,
    userId: string,
    updateCardDto: UpdateCardDto,
  ): Promise<CardEntity> {
    const user = await this.userService.findById(userId);
    return await this.cardRepository.update(id, user, updateCardDto);
  }

  async remove(id: string): Promise<void> {
    return await this.cardRepository.remove(id);
  }
}
