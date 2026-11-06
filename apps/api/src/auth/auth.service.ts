import { PasswordHasher } from '@nestjs/authentication';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CompanyMemberDto } from '../companies/dto/company-member.dto';
import { CompanyMemberEntity } from '../companies/entities/company-member.entity';
import { UserEntity, UserRoles } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { CurrentUser } from './dtos/current-user.dto';
import { JwtPayload } from './dtos/jwt-payload.dto';
import { SigningDto } from './dtos/signing.dto';
import { SignupDto } from './dtos/signup.dto';

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
      role: UserRoles.USER,
      companyMembers: [],
    });

    return await this.signIn({
      email: signupDto.email,
      password: signupDto.password,
    });
  }

  async signIn(signingDto: SigningDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findOneByEmail(signingDto.email, { companyMembers: true });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isMatch = await this.checkPassword(signingDto.password, user.hashedPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const currentUser = toCurrentUser(user);
    const jwtPayload: JwtPayload = { user: currentUser };

    return {
      bearerToken: await this.jwtService.signAsync(jwtPayload),
      user: currentUser,
    };
  }
}

function toCurrentUser(user: UserEntity): CurrentUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    companyMembers: (user.companyMembers ?? []).map(toTokenCompanyMember),
  };
}

function toTokenCompanyMember(member: CompanyMemberEntity): CompanyMemberDto {
  return {
    id: member.id,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    deletedAt: member.deletedAt,
    isActive: member.isActive,
    companyId: member.companyId,
    userId: member.userId,
    role: member.role,
  } as CompanyMemberDto;
}
