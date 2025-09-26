import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { BoardModule } from '../board/board.module';
import { BoardMemberModule } from '../board-member/board-member.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [BoardModule, BoardMemberModule, UserModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
