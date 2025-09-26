import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardEntity } from './entities/board.entity';
import { User } from '../auth/decorator/user.decorator';
import { BoardMemberRole } from '../../constants/board-member-role.enum';
import { PaginateQuery } from '../../common/decorators/paginate-query.decorator';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { RolesAuth } from '../../common/decorators/roles-auth.decorator';

@Controller('boards')
@RolesAuth()
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @User('id') userId: string,
  ): Promise<BoardEntity> {
    return await this.boardService.create(createBoardDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @User('id') userId: string,
    @PaginateQuery() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BoardEntity>> {
    return await this.boardService.findAll(userId, pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User('id') userId: string,
  ): Promise<BoardEntity> {
    return await this.boardService.findOne(id, userId);
  }

  @Patch(':id')
  @RolesAuth(BoardMemberRole.OWNER)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @User('id') userId: string,
  ) {
    return this.boardService.update(id, updateBoardDto, userId);
  }

  @Delete(':id')
  @RolesAuth(BoardMemberRole.OWNER)
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User('id') userId: string,
  ) {
    return this.boardService.remove(id, userId);
  }
}
