import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getOrmConfig } from './typeorm.config';
import { UserModule } from './modules/user/user.module';
import { BoardModule } from './modules/board/board.module';
import { ListModule } from './modules/list/list.module';
import { CardModule } from './modules/card/card.module';
import { AuthModule } from './modules/auth/auth.module';
import { BoardMemberModule } from './modules/board-member/board-member.module';
import { MemberModule } from './modules/member/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getOrmConfig,
    }),
    UserModule,
    BoardModule,
    ListModule,
    CardModule,
    AuthModule,
    BoardMemberModule,
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
