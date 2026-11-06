import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

import { bearer, createE2eApp, resetDatabase, signUp } from './e2e-app';
import { e2eAdmin } from './e2e-env';

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createE2eApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/signup creates a user and returns a bearer token', async () => {
    const response = await request(app.getHttpServer()).post('/auth/signup').send({
      email: 'ada@example.com',
      name: 'Ada Lovelace',
      password: 'password123',
      passwordConfirm: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.bearerToken).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      email: 'ada@example.com',
      name: 'Ada Lovelace',
      role: 'USER',
    });
    expect(response.body.user.hashedPassword).toBeUndefined();
    expect(response.body.user.id).toEqual(expect.any(String));
  });

  it('POST /auth/signup rejects invalid bodies', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'not-an-email', name: '', password: 'short', passwordConfirm: 'short' })
      .expect(400);
  });

  it('POST /auth/signup rejects a duplicate email', async () => {
    await signUp(app, { email: 'ada@example.com', name: 'Ada' });

    const response = await request(app.getHttpServer()).post('/auth/signup').send({
      email: 'ada@example.com',
      name: 'Ada Again',
      password: 'password123',
      passwordConfirm: 'password123',
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('POST /auth/signin returns a token for the seeded admin', async () => {
    const response = await request(app.getHttpServer()).post('/auth/signin').send({
      email: e2eAdmin.email,
      password: e2eAdmin.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      email: e2eAdmin.email,
      name: e2eAdmin.name,
      role: 'ADMIN',
    });
    expect(response.body.bearerToken).toEqual(expect.any(String));
  });

  it('POST /auth/signin rejects an unknown email and a wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'missing@example.com', password: 'password123' })
      .expect(401);

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: e2eAdmin.email, password: 'wrong-password' })
      .expect(401);
  });

  it('GET /auth/profile returns the signed-in user and rejects missing credentials', async () => {
    const { bearerToken, user } = await signUp(app, { email: 'ada@example.com', name: 'Ada Lovelace' });

    await request(app.getHttpServer()).get('/auth/profile').expect(401);

    await request(app.getHttpServer()).get('/auth/profile').set(bearer('not-a-jwt')).expect(401);

    const response = await request(app.getHttpServer()).get('/auth/profile').set(bearer(bearerToken)).expect(200);

    expect(response.body).toMatchObject({
      id: user.id,
      email: 'ada@example.com',
      name: 'Ada Lovelace',
      role: 'USER',
    });
  });
});
