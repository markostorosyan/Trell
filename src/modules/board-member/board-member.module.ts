import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardMemberEntity } from './entities/board-member.entity';
import { BoardMemberService } from './board-member.service';
import { BoardMemberController } from './board-member.controller';
import { BoardMemberRepository } from './board-member.repository';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMemberEntity])],
  controllers: [BoardMemberController],
  providers: [BoardMemberService, BoardMemberRepository, RolesGuard],
  exports: [BoardMemberService],
})
export class BoardMemberModule {}
