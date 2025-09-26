import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListRepository } from './list.repository';
import { UserService } from '../user/user.service';
import { ListEntity } from './entities/list.entity';
import { BoardService } from '../board/board.service';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';

@Injectable()
export class ListService {
  constructor(
    private listRepository: ListRepository,
    private userService: UserService,
    private boardService: BoardService,
  ) {}

  async create(
    boardId: string,
    userId: string,
    createListDto: CreateListDto,
  ): Promise<ListEntity> {
    const board = await this.boardService.findOne(boardId, userId);
    const user = await this.userService.findById(userId);
    return await this.listRepository.create(board, user, createListDto);
  }

  async findAll(
    boardId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ListEntity>> {
    return await this.listRepository.findAll(boardId, pageOptionsDto);
  }

  async findOne(id: string, join: boolean = false): Promise<ListEntity> {
    return await this.listRepository.findOne(id, join);
  }

  async update(
    id: string,
    userId: string,
    updateListDto: UpdateListDto,
  ): Promise<ListEntity> {
    const user = await this.userService.findById(userId);
    return await this.listRepository.update(id, user, updateListDto);
  }

  async remove(id: string): Promise<void> {
    return await this.listRepository.remove(id);
  }
}
