import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { compareData } from '../../utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserTokenService } from '../user/user-token.service';
import { TokensDto } from './dto/tokens.dto';
import { InvalidRefreshTokenException } from './exception/invalid-refresh-token.exception';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userTokenService: UserTokenService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(loginDto.email);
    const isMatch = await compareData(
      loginDto.password,
      user.password,
      'password',
    );
    if (user && isMatch) {
      return user;
    }
  }

  getTokens(userId: string, email: string) {
    const payload = { id: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES'),
    });

    return { accessToken, refreshToken };
  }

  private parseTime(timeStr: string): number {
    const match = timeStr.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error('Invalid time format');

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error('Unsupported unit');
    }
  }

  async login(user: UserEntity): Promise<TokensDto> {
    const tokens = this.getTokens(user.id, user.email);

    const durationMs = this.parseTime(this.config.get('JWT_REFRESH_EXPIRES'));
    const expiresAt = new Date(Date.now() + durationMs);

    await this.userTokenService.saveRefreshToken(
      user,
      tokens.refreshToken,
      expiresAt,
    );

    return tokens;
  }

  async refresh(userId: string, refreshToken: string): Promise<TokensDto> {
    const validToken = await this.userTokenService.validateRefreshToken(
      userId,
      refreshToken,
    );
    if (!validToken) throw new InvalidRefreshTokenException();

    const { user } = validToken;
    const tokens = this.getTokens(user.id, user.email);

    const durationMs = this.parseTime(this.config.get('JWT_REFRESH_EXPIRES'));
    const expiresAt = new Date(Date.now() + durationMs);

    await this.userTokenService.updateRefreshToken(
      user,
      tokens.refreshToken,
      expiresAt,
    );

    return tokens;
  }

  async register(createUserDto: CreateUserDto): Promise<TokensDto> {
    const user = await this.userService.create(createUserDto);
    const tokens = this.getTokens(user.id, user.email);

    const durationMs = this.parseTime(this.config.get('JWT_REFRESH_EXPIRES'));
    const expiresAt = new Date(Date.now() + durationMs);

    await this.userTokenService.saveRefreshToken(
      user,
      tokens.refreshToken,
      expiresAt,
    );

    return tokens;
  }
}
