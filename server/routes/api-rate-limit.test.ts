import request from 'supertest';
import { Express } from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/**
 * Render health checks poll `/api/health` every few seconds, so health/ready
 * must bypass the `/api` read limiter while other `/api` routes stay limited.
 */
describe('api rate limiting', () => {
  let app: Express;
  const originalRateLimitMax = process.env.RATE_LIMIT_MAX;
  const originalRelax = process.env.E2E_RELAX_RATE_LIMIT;
  const limit = 2;

  beforeAll(async () => {
    process.env.RATE_LIMIT_MAX = String(limit);
    process.env.E2E_RELAX_RATE_LIMIT = 'false';
    const { createApp } = await import('@server/app.js');
    app = createApp();
  });

  afterAll(() => {
    process.env.RATE_LIMIT_MAX = originalRateLimitMax;
    process.env.E2E_RELAX_RATE_LIMIT = originalRelax;
  });

  it('does not rate-limit /api/health or /api/ready', async () => {
    for (let i = 0; i < limit + 3; i += 1) {
      const health = await request(app).get('/api/health').expect(200);
      expect(health.headers['ratelimit-limit']).toBeUndefined();
      const ready = await request(app).get('/api/ready').expect(503);
      expect(ready.headers['ratelimit-limit']).toBeUndefined();
    }
  });

  it('still rate-limits other /api routes', async () => {
    for (let i = 0; i < limit; i += 1) {
      await request(app).get('/api/hello').expect(200);
    }
    await request(app).get('/api/hello').expect(429);
  });
});
