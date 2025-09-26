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
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardEntity } from './entities/card.entity';
import { User } from '../auth/decorator/user.decorator';
import { BoardMemberRole } from '../../constants/board-member-role.enum';
import { RolesAuth } from '../../common/decorators/roles-auth.decorator';
import { PageDto } from '../../common/dto/page.dto';
import { PaginateQuery } from '../../common/decorators/paginate-query.decorator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Controller('boards/:boardId/lists/:listId/cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @RolesAuth(BoardMemberRole.OWNER, BoardMemberRole.MEMBER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCardDto: CreateCardDto,
    @Param('listId', new ParseUUIDPipe()) listId: string,
    @User('id') userId: string,
  ): Promise<CardEntity> {
    return await this.cardService.create(listId, userId, createCardDto);
  }

  @Get()
  @RolesAuth(
    BoardMemberRole.MEMBER,
    BoardMemberRole.OWNER,
    BoardMemberRole.VIEWER,
  )
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('listId', new ParseUUIDPipe()) listId: string,
    @PaginateQuery() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CardEntity>> {
    return this.cardService.findAll(listId, pageOptionsDto);
  }

  @Get(':id')
  @RolesAuth(
    BoardMemberRole.MEMBER,
    BoardMemberRole.OWNER,
    BoardMemberRole.VIEWER,
  )
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('join', ParseBoolPipe) join: boolean,
  ): Promise<CardEntity> {
    return await this.cardService.findOne(id, join);
  }

  @Patch(':id')
  @RolesAuth(BoardMemberRole.OWNER, BoardMemberRole.MEMBER)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User('id') userId: string,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<CardEntity> {
    return this.cardService.update(id, userId, updateCardDto);
  }

  @Delete(':id')
  @RolesAuth(BoardMemberRole.OWNER, BoardMemberRole.MEMBER)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.cardService.remove(id);
  }
}
