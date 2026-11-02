import { Request, Controller, Get, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from '@nestjs/authentication';

import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { SigningDto } from './dtos/signing.dto';
import { CurrentUser } from './dtos/current-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create an account' })
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    return await this.authService.signUp(signupDto);
  }

  @Post('signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in to the application' })
  signIn(@Body() signInDto: SigningDto): Promise<AuthResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@Request() req: any): Promise<CurrentUser> {
    return req.user;
  }
}
