import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

import { CompanyMemberRole } from '../src/companies/entities/company-member.entity';
import { bearer, createE2eApp, resetDatabase, signIn, signInAsAdmin, signUp } from './e2e-app';

describe('CompanyMemberController (e2e)', () => {
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

  async function createCompany(name: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/companies')
      .set(bearer(adminToken))
      .send({ name })
      .expect(201);

    return response.body.id as string;
  }

  it('rejects anonymous callers and users who are not admins or managers', async () => {
    await request(app.getHttpServer()).get('/company-members').expect(401);

    const companyId = await createCompany('Acme');
    const viewer = await signUp(app, { email: 'viewer@example.com', name: 'Viewer' });
    const outsider = await signUp(app, { email: 'outsider@example.com', name: 'Outsider' });

    await request(app.getHttpServer())
      .post('/company-members')
      .set(bearer(adminToken))
      .send({ companyId, userId: viewer.user.id, role: CompanyMemberRole.VIEWER })
      .expect(201);

    const viewerSession = await signIn(app, 'viewer@example.com', 'password123');
    await request(app.getHttpServer())
      .post('/company-members')
      .set(bearer(viewerSession.bearerToken))
      .send({ companyId, userId: outsider.user.id, role: CompanyMemberRole.VIEWER })
      .expect(403);

    await request(app.getHttpServer()).get('/company-members').set(bearer(viewerSession.bearerToken)).expect(403);
  });

  it('lets a company manager add a member of that company', async () => {
    const companyId = await createCompany('Acme');
    const otherCompanyId = await createCompany('Other');
    const manager = await signUp(app, { email: 'manager@example.com', name: 'Manager' });
    const hire = await signUp(app, { email: 'hire@example.com', name: 'Hire' });

    await request(app.getHttpServer())
      .post('/company-members')
      .set(bearer(adminToken))
      .send({ companyId, userId: manager.user.id, role: CompanyMemberRole.MANAGER })
      .expect(201);

    const managerSession = await signIn(app, 'manager@example.com', 'password123');
    expect(managerSession.user.companyMembers).toEqual([
      expect.objectContaining({ companyId, role: CompanyMemberRole.MANAGER }),
    ]);

    const created = await request(app.getHttpServer())
      .post('/company-members')
      .set(bearer(managerSession.bearerToken))
      .send({ companyId, userId: hire.user.id, role: CompanyMemberRole.VIEWER })
      .expect(201);
    expect(created.body).toMatchObject({
      companyId,
      userId: hire.user.id,
      role: CompanyMemberRole.VIEWER,
    });

    await request(app.getHttpServer())
      .post('/company-members')
      .set(bearer(managerSession.bearerToken))
      .send({ companyId: otherCompanyId, userId: hire.user.id, role: CompanyMemberRole.VIEWER })
      .expect(403);
  });

  it('lists, reads, updates, and deletes members as an admin', async () => {
    const companyId = await createCompany('Acme');
    const memberUser = await signUp(app, { email: 'member@example.com', name: 'Member' });

    const created = await request(app.getHttpServer())
      .post('/company-members')
      .set(bearer(adminToken))
      .send({ companyId, userId: memberUser.user.id, role: CompanyMemberRole.VIEWER })
      .expect(201);

    const listed = await request(app.getHttpServer()).get('/company-members').set(bearer(adminToken)).expect(200);
    expect(listed.body).toEqual([
      expect.objectContaining({ id: created.body.id, companyId, userId: memberUser.user.id }),
    ]);

    const found = await request(app.getHttpServer())
      .get(`/company-members/${created.body.id}`)
      .set(bearer(adminToken))
      .expect(200);
    expect(found.body).toMatchObject({ id: created.body.id, role: CompanyMemberRole.VIEWER });

    const updated = await request(app.getHttpServer())
      .patch(`/company-members/${created.body.id}`)
      .set(bearer(adminToken))
      .send({ role: CompanyMemberRole.OWNER })
      .expect(200);
    expect(updated.body).toMatchObject({ id: created.body.id, role: CompanyMemberRole.OWNER });

    await request(app.getHttpServer())
      .delete(`/company-members/${created.body.id}`)
      .set(bearer(adminToken))
      .expect(200);

    const missing = await request(app.getHttpServer())
      .get(`/company-members/${created.body.id}`)
      .set(bearer(adminToken))
      .expect(200);
    expect(missing.body).toBeNull();
  });
});
