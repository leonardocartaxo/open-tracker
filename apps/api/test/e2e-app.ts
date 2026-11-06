import { PasswordHasher } from '@nestjs/authentication';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';

import { AppModule } from '../src/app.module';
import { AdminSeedService } from '../src/auth/admin-seed.service';
import { CompanyMemberEntity } from '../src/companies/entities/company-member.entity';
import { CompanyEntity } from '../src/companies/entities/company.entity';
import { configureApp } from '../src/configure-app';
import { UserEntity } from '../src/users/entities/user.entity';
import { e2eAdmin } from './e2e-env';

export interface AuthBody {
  bearerToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyMembers: Array<{ companyId: string; role: string }>;
  };
}

export async function createE2eApp(): Promise<NestFastifyApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PasswordHasher)
    .useValue(new PasswordHasher({ logN: 10 }))
    .compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter(), {
    logger: false,
  });
  configureApp(app);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
}

export async function resetDatabase(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  await dataSource.getRepository(CompanyMemberEntity).clear();
  await dataSource.getRepository(CompanyEntity).clear();
  await dataSource.getRepository(UserEntity).clear();
  await app.get(AdminSeedService).onModuleInit();
}

export async function signIn(app: INestApplication, email: string, password: string): Promise<AuthBody> {
  const response = await request(app.getHttpServer()).post('/auth/signin').send({ email, password }).expect(200);

  return response.body as AuthBody;
}

export async function signInAsAdmin(app: INestApplication): Promise<string> {
  const body = await signIn(app, e2eAdmin.email, e2eAdmin.password);

  return body.bearerToken;
}

export async function signUp(
  app: INestApplication,
  input: { email: string; name: string; password?: string },
): Promise<AuthBody> {
  const password = input.password ?? 'password123';
  const response = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      email: input.email,
      name: input.name,
      password,
      passwordConfirm: password,
    })
    .expect(200);

  return response.body as AuthBody;
}

export function bearer(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
