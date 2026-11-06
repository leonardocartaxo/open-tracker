import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export async function typeOrmModuleOptions(configService: ConfigService): Promise<TypeOrmModuleOptions> {
  if (configService.get<string>('DB_TYPE') === 'sqlite') {
    const sqlite = await import('better-sqlite3');

    return {
      type: 'better-sqlite3',
      database: ':memory:',
      driver: sqlite.default,
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    };
  }

  return {
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    autoLoadEntities: true,
    logging: true,
    synchronize: true,
  };
}
