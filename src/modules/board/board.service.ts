import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardRepository } from './board.repository';
import { UserService } from '../user/user.service';
import { BoardEntity } from './entities/board.entity';
import { BoardMemberService } from '../board-member/board-member.service';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private userService: UserService,
    private boardMemberService: BoardMemberService,
  ) {}

  async create(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<BoardEntity> {
    const owner = await this.userService.findById(userId);
    const boardEntity = await this.boardRepository.create(
      createBoardDto,
      owner,
    );

    await this.boardMemberService.addOwner(owner, boardEntity);

    if (createBoardDto.users && createBoardDto.users.length > 0) {
      const userEmails = createBoardDto.users.map((u) => u.email);
      const users = await this.userService.findByIds(userEmails);

      await this.boardMemberService.addMembers(
        boardEntity,
        createBoardDto.users,
        users,
      );
    }

    return boardEntity;
  }

  async checkBoardExistAndOwner(
    id: string,
    ownerId: string,
  ): Promise<BoardEntity> {
    return await this.boardRepository.checkBoardExistAndOwner(id, ownerId);
  }

  async findAll(
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<BoardEntity>> {
    return await this.boardRepository.findAll(userId, pageOptionsDto);
  }

  async findOne(id: string, userId: string): Promise<BoardEntity> {
    return await this.boardRepository.findOne(id, userId);
  }

  async update(
    id: string,
    updateBoardDto: UpdateBoardDto,
    userId: string,
  ): Promise<BoardEntity> {
    return await this.boardRepository.update(id, updateBoardDto, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    return await this.boardRepository.remove(id, userId);
  }
}
