import { Injectable } from '@nestjs/common';
import { UserTokenRepository } from './user-token.repository';
import { UserEntity } from './entities/user.entity';
import { UserTokenEntity } from './entities/user-token.entity';

@Injectable()
export class UserTokenService {
  constructor(private userTokenRepository: UserTokenRepository) {}

  async saveRefreshToken(
    user: UserEntity,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<UserTokenEntity> {
    return await this.userTokenRepository.saveRefreshToken(
      user,
      refreshToken,
      expiresAt,
    );
  }

  async updateRefreshToken(
    user: UserEntity,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<UserTokenEntity> {
    return await this.userTokenRepository.updateRefreshToken(
      user,
      refreshToken,
      expiresAt,
    );
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserTokenEntity | null> {
    return await this.userTokenRepository.validateRefreshToken(
      userId,
      refreshToken,
    );
  }

  async revokeAllTokens(userId: string): Promise<void> {
    await this.userTokenRepository.revokeAllTokens(userId);
  }
}
