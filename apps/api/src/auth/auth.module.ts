import {PasswordHasher} from '@nestjs/authentication';
import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {AdminSeedService} from './admin-seed.service.js';
import {AuthService} from './auth.service.js';
import {AuthController} from './auth.controller.js';
import {UsersModule} from '../users/users.module.js';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtStrategy} from './strategies/jwt.strategy.js';

@Module({
	imports: [
		UsersModule,
        PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
			}),
			inject: [ConfigService],
		}),
	],
	providers: [AuthService, AdminSeedService, JwtStrategy, PasswordHasher],
	controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}
