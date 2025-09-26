import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserTokenEntity } from './entities/user-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenRepository } from './user-token.repository';
import { UserTokenService } from './user-token.service';
import { BoardMemberModule } from '../board-member/board-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserTokenEntity]),
    BoardMemberModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserTokenService,
    UserTokenRepository,
  ],
  exports: [UserService, UserTokenService],
})
export class UserModule {}
