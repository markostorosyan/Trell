import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from '../dto/payload.dto';
import { Request } from 'express';
import { IJwtRefreshPayload } from 'src/interfaces/jwtRefreshPayload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: PayloadDto): IJwtRefreshPayload {
    const authHeader: string | undefined = req.get('Authorization');
    if (!authHeader) {
      throw new Error('No Authorization header');
    }

    const refreshToken: string = authHeader.replace('Bearer', '').trim();

    return { ...payload, refreshToken };
  }
}
