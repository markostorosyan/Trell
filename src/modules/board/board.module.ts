import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from './entities/board.entity';
import { BoardRepository } from './board.repository';
import { UserModule } from '../user/user.module';
import { BoardMemberModule } from '../board-member/board-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardEntity]),
    UserModule,
    BoardMemberModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository],
  exports: [BoardService],
})
export class BoardModule {}
