import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { User } from '../auth/decorator/user.decorator';
import { BoardMemberRole } from '../../constants/board-member-role.enum';
import { ListEntity } from './entities/list.entity';
import { RolesAuth } from '../../common/decorators/roles-auth.decorator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PaginateQuery } from '../../common/decorators/paginate-query.decorator';
import { PageDto } from '../../common/dto/page.dto';

@Controller('boards/:boardId/lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @RolesAuth(BoardMemberRole.OWNER, BoardMemberRole.MEMBER)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createListDto: CreateListDto,
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @User('id') userId: string,
  ) {
    return this.listService.create(boardId, userId, createListDto);
  }

  @Get()
  @RolesAuth(
    BoardMemberRole.MEMBER,
    BoardMemberRole.OWNER,
    BoardMemberRole.VIEWER,
  )
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @PaginateQuery() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ListEntity>> {
    return this.listService.findAll(boardId, pageOptionsDto);
  }

  @Get(':listId')
  @RolesAuth(
    BoardMemberRole.MEMBER,
    BoardMemberRole.OWNER,
    BoardMemberRole.VIEWER,
  )
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('listId', new ParseUUIDPipe()) listId: string,
    @Query('join', ParseBoolPipe) join?: boolean,
  ): Promise<ListEntity> {
    return this.listService.findOne(listId, join);
  }

  @Patch(':listId')
  @RolesAuth(BoardMemberRole.OWNER, BoardMemberRole.MEMBER)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('listId', new ParseUUIDPipe()) listId: string,
    @User('id') userId: string,
    @Body() updateListDto: UpdateListDto,
  ): Promise<ListEntity> {
    return await this.listService.update(listId, userId, updateListDto);
  }

  @Delete(':listId')
  @RolesAuth(BoardMemberRole.OWNER, BoardMemberRole.MEMBER)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('listId', new ParseUUIDPipe()) listId: string,
  ): Promise<void> {
    return await this.listService.remove(listId);
  }
}
