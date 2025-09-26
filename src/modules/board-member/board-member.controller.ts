import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { BoardMemberService } from './board-member.service';
import { BoardMemberEntity } from './entities/board-member.entity';
import { BoardMemberRole } from '../../constants/board-member-role.enum';
import { PaginateQuery } from '../../common/decorators/paginate-query.decorator';
import { BoardPageOptionsDto } from '../board/dto/board-page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { User } from '../auth/decorator/user.decorator';
import { RolesAuth } from '../../common/decorators/roles-auth.decorator';

@Controller('boards/:boardId/members')
export class BoardMemberController {
  constructor(private boardMemberService: BoardMemberService) {}

  @Get()
  @RolesAuth(BoardMemberRole.OWNER)
  @HttpCode(HttpStatus.OK)
  async findAllByBoard(
    @Param('boardId') boardId: string,
    @User('id') ownerId: string,
    @PaginateQuery() pageOptionsDto: BoardPageOptionsDto,
  ): Promise<PageDto<BoardMemberEntity>> {
    return await this.boardMemberService.findAllByBoard(
      boardId,
      ownerId,
      pageOptionsDto,
    );
  }
}
