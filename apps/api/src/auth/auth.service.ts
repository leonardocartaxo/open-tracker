import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import {UserEntity, UserRoles} from '../users/entities/user.entity.js';
import {SigningDto} from "./dtos/signing.dto.js";
import {SignupDto} from "./dtos/signup.dto.js";
import {AuthResponseDto} from "./dtos/auth-response.dto.js";
import {UsersService} from '../users/users.service.js';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
      private readonly passwordHasher: PasswordHasher,
      private readonly jwtService: JwtService,
      private readonly usersService: UsersService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return this.passwordHasher.hash(password);
  }

  async checkPassword(password: string, storedHash: string): Promise<boolean> {
    return this.passwordHasher.verify(password, storedHash);
  }

  async signUp(signupDto: SignupDto): Promise<AuthResponseDto> {
    const hashedPassword = await this.hashPassword(signupDto.password);
    await this.usersService.create({
      email: signupDto.email,
      name: signupDto.name,
      hashedPassword,
      roles: [UserRoles.USER]
    });

    return await this.signIn({
      email: signupDto.email,
      password: signupDto.password
    });
  }

  async signIn(signingDto: SigningDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findOneByEmail(signingDto.email);
    if(!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isMatch = await this.checkPassword(signingDto.password, user.hashedPassword);
    if(!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      bearerToken: await this.jwtService.signAsync({ id: user.id, email: user.email }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      }
    };
  }
}
