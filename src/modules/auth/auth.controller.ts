import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { TokensDto } from './dto/tokens.dto';
import { IJwtRefreshRequest } from '../../interfaces/jwtRefreshRequest.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokensDto> {
    const user = await this.authService.validateUser(loginDto);

    const tokens = await this.authService.login(user);

    return tokens;
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Req() req: IJwtRefreshRequest): Promise<TokensDto> {
    return this.authService.refresh(req.user.id, req.user.refreshToken);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto): Promise<TokensDto> {
    return this.authService.register(createUserDto);
  }
}
