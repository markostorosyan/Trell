import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from './entities/card.entity';
import { CardRepository } from './card.repository';
import { UserModule } from '../user/user.module';
import { ListModule } from '../list/list.module';
import { BoardMemberModule } from '../board-member/board-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity]),
    UserModule,
    ListModule,
    BoardMemberModule,
  ],
  controllers: [CardController],
  providers: [CardService, CardRepository],
})
export class CardModule {}
