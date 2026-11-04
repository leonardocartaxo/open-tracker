import { Public } from '@nestjs/authentication';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { UserRoles } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { RolesAllowed } from './decorators/roles.decorator';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { CurrentUser } from './dtos/current-user.dto';
import { SigningDto } from './dtos/signing.dto';
import { SignupDto } from './dtos/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @RolesAllowed(UserRoles.USER)
  getProfile(@Request() req: any): Promise<CurrentUser> {
    return req.user;
  }
}
