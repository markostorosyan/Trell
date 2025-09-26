import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTokenEntity } from './entities/user-token.entity';
import { Repository } from 'typeorm';
import { compareData, hashData } from 'src/utils';
import { UserEntity } from './entities/user.entity';
import { RefreshTokenNotFoundException } from './exception/refresh-token-not-found.exception';

@Injectable()
export class UserTokenRepository {
  constructor(
    @InjectRepository(UserTokenEntity)
    private userTokenRepository: Repository<UserTokenEntity>,
  ) {}

  async saveRefreshToken(
    user: UserEntity,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<UserTokenEntity> {
    const tokenExist = await this.tokenExist(user.id);

    if (tokenExist) {
      return await this.updateRefreshToken(user, refreshToken, expiresAt);
    }

    const hash = await hashData(refreshToken);
    const userToken = this.userTokenRepository.create({
      user,
      hashedRefreshToken: hash,
      expiresAt,
    });

    return this.userTokenRepository.save(userToken);
  }

  async updateRefreshToken(
    user: UserEntity,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<UserTokenEntity> {
    const tokenEntity = await this.findByUserId(user.id);
    const hash = await hashData(refreshToken);
    this.userTokenRepository.merge(tokenEntity, {
      user,
      hashedRefreshToken: hash,
      expiresAt,
    });

    await this.userTokenRepository.save(tokenEntity);

    return tokenEntity;
  }

  async tokenExist(id: string): Promise<boolean> {
    const exist = await this.userTokenRepository.findOne({
      where: { user: { id } },
      relations: ['user'],
    });

    if (!exist) {
      return false;
    }

    return true;
  }

  async findByUserId(id: string): Promise<UserTokenEntity> {
    if (!id) {
      throw new BadRequestException();
    }
    const tokenEntity = await this.userTokenRepository.findOne({
      where: { user: { id } },
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new RefreshTokenNotFoundException();
    }

    return tokenEntity;
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserTokenEntity | null> {
    const tokens = await this.findByUserId(userId);
    if (!tokens) {
      return null;
    }
    const isValid = await compareData(
      refreshToken,
      tokens.hashedRefreshToken,
      'token',
    );
    if (isValid && tokens.expiresAt > new Date() && tokens.user.id === userId) {
      return tokens;
    }

    return null;
  }

  async revokeAllTokens(userId: string): Promise<void> {
    await this.userTokenRepository.delete({ user: { id: userId } });
  }
}
