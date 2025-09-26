import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListEntity } from './entities/list.entity';
import { ListRepository } from './list.repository';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';
import { BoardMemberModule } from '../board-member/board-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListEntity]),
    UserModule,
    BoardModule,
    BoardMemberModule,
  ],
  controllers: [ListController],
  providers: [ListService, ListRepository],
  exports: [ListService],
})
export class ListModule {}
