import {Request, Controller, Get, Post, Body, HttpStatus, HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import {ApiOperation} from "@nestjs/swagger";
import {SignupDto} from "./dtos/signup.dto.js";
import {AuthResponseDto} from "./dtos/auth-response.dto.js";
import {Public} from '@nestjs/authentication';
import {SigningDto} from './dtos/signing.dto.js';
import { CurrentUser } from './dtos/current-user.dto.js';

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
