import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

import { createE2eApp } from './e2e-app';

describe('HealthController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns ok without authentication', async () => {
    await request(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok' });
  });
});
