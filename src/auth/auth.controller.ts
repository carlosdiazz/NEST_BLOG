import {
  Controller,
  Post,
  HttpCode,
  UseGuards,
  Req,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './guards/localAuth.guard';
import { CreateUserDto } from './../components/users/user.dto';
import { JwtAuthenticationGuard } from './guards/jwtAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('/login')
  login(@Req() request: RequestWithUser, @Res() response: Response) {
    const user = request.user;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('/logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
}
