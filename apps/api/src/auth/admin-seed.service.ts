import { PasswordHasher } from '@nestjs/authentication';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserRoles } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async onModuleInit(): Promise<void> {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const name = this.configService.get<string>('ADMIN_NAME');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    if (!email || !name || !password) {
      return;
    }

    const existing = await this.usersService.findOneByEmail(email);
    if (existing) {
      return;
    }

    await this.usersService.create({
      email,
      name,
      hashedPassword: await this.passwordHasher.hash(password),
      roles: [UserRoles.ADMIN, UserRoles.USER],
    });
    this.logger.log(`Created admin user ${email}`);
  }
}
