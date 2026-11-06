import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

import { bearer, createE2eApp, resetDatabase, signInAsAdmin, signUp } from './e2e-app';

describe('CompaniesController (e2e)', () => {
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
    await request(app.getHttpServer()).get('/companies').expect(401);

    const user = await signUp(app, { email: 'ada@example.com', name: 'Ada' });
    await request(app.getHttpServer()).get('/companies').set(bearer(user.bearerToken)).expect(403);
    await request(app.getHttpServer())
      .post('/companies')
      .set(bearer(user.bearerToken))
      .send({ name: 'Acme' })
      .expect(403);
  });

  it('creates, lists, reads, updates, and deletes companies', async () => {
    const created = await request(app.getHttpServer())
      .post('/companies')
      .set(bearer(adminToken))
      .send({ name: 'Acme' })
      .expect(201);

    expect(created.body).toMatchObject({ name: 'Acme', isActive: true });
    expect(created.body.id).toEqual(expect.any(String));

    const listed = await request(app.getHttpServer()).get('/companies').set(bearer(adminToken)).expect(200);
    expect(listed.body).toEqual([expect.objectContaining({ id: created.body.id, name: 'Acme' })]);

    const found = await request(app.getHttpServer())
      .get(`/companies/${created.body.id}`)
      .set(bearer(adminToken))
      .expect(200);
    expect(found.body).toMatchObject({ id: created.body.id, name: 'Acme' });

    const updated = await request(app.getHttpServer())
      .patch(`/companies/${created.body.id}`)
      .set(bearer(adminToken))
      .send({ name: 'Acme Inc' })
      .expect(200);
    expect(updated.body).toMatchObject({ id: created.body.id, name: 'Acme Inc' });

    await request(app.getHttpServer()).delete(`/companies/${created.body.id}`).set(bearer(adminToken)).expect(200);

    const missing = await request(app.getHttpServer())
      .get(`/companies/${created.body.id}`)
      .set(bearer(adminToken))
      .expect(200);
    expect(missing.body).toBeNull();
  });

  it('POST /companies rejects an empty name', async () => {
    await request(app.getHttpServer()).post('/companies').set(bearer(adminToken)).send({ name: '' }).expect(400);
  });
});
