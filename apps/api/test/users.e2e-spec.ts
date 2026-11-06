import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

import { UserRoles } from '../src/users/entities/user.entity';
import { bearer, createE2eApp, resetDatabase, signInAsAdmin, signUp } from './e2e-app';

describe('UsersController (e2e)', () => {
  let app: NestFastifyApplication;
  let adminToken: string;

  beforeAll(async () => {
    app = await createE2eApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
    adminToken = await signInAsAdmin(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects anonymous and non-admin callers', async () => {
    await request(app.getHttpServer()).get('/users').expect(401);

    const user = await signUp(app, { email: 'ada@example.com', name: 'Ada' });
    await request(app.getHttpServer()).get('/users').set(bearer(user.bearerToken)).expect(403);
    await request(app.getHttpServer()).post('/users').set(bearer(user.bearerToken)).send({}).expect(403);
  });

  it('creates, lists, reads, updates, and deletes users', async () => {
    const created = await request(app.getHttpServer())
      .post('/users')
      .set(bearer(adminToken))
      .send({
        email: 'grace@example.com',
        name: 'Grace Hopper',
        hashedPassword: 'stored-hash',
        role: UserRoles.USER,
        companyMembers: [],
      })
      .expect(201);

    expect(created.body).toMatchObject({
      email: 'grace@example.com',
      name: 'Grace Hopper',
      role: UserRoles.USER,
      isActive: true,
    });
    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.hashedPassword).toBeUndefined();

    const listed = await request(app.getHttpServer()).get('/users').set(bearer(adminToken)).expect(200);
    expect(listed.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: 'grace@example.com' }),
        expect.objectContaining({ email: 'admin@example.com', role: UserRoles.ADMIN }),
      ]),
    );
    expect(listed.body.every((user: { hashedPassword?: string }) => user.hashedPassword === undefined)).toBe(true);

    const found = await request(app.getHttpServer())
      .get(`/users/${created.body.id}`)
      .set(bearer(adminToken))
      .expect(200);
    expect(found.body).toMatchObject({ id: created.body.id, email: 'grace@example.com' });
    expect(found.body.hashedPassword).toBeUndefined();

    const updated = await request(app.getHttpServer())
      .patch(`/users/${created.body.id}`)
      .set(bearer(adminToken))
      .send({ name: 'Grace B. Hopper', role: UserRoles.ADMIN })
      .expect(200);
    expect(updated.body).toMatchObject({
      id: created.body.id,
      email: 'grace@example.com',
      name: 'Grace B. Hopper',
      role: UserRoles.ADMIN,
    });

    await request(app.getHttpServer()).delete(`/users/${created.body.id}`).set(bearer(adminToken)).expect(200);

    const missing = await request(app.getHttpServer())
      .get(`/users/${created.body.id}`)
      .set(bearer(adminToken))
      .expect(200);
    expect(missing.body).toBeNull();
  });

  it('POST /users rejects an invalid email', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .set(bearer(adminToken))
      .send({ email: 'not-an-email', name: 'Grace' })
      .expect(400);
  });
});
