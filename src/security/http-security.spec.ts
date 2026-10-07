import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  applyHttpSecurity,
  isSwaggerEnabled,
  parseAllowedOrigins,
} from './http-security';

@Controller('ping')
class PingController {
  @Get()
  ping() {
    return { ok: true };
  }
}

const ALLOWED = 'https://sigescointer.oaxaca.gob.mx';

async function createApp(
  swaggerEnabled: boolean,
): Promise<INestApplication<App>> {
  const moduleRef = await Test.createTestingModule({
    controllers: [PingController],
  }).compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>();
  applyHttpSecurity(app, { allowedOrigins: [ALLOWED], swaggerEnabled });
  await app.init();
  return app;
}

describe('parseAllowedOrigins', () => {
  it('splits and trims a comma separated list', () => {
    expect(parseAllowedOrigins(' https://a.mx , https://b.mx ')).toEqual([
      'https://a.mx',
      'https://b.mx',
    ]);
  });

  it('throws when the value is missing or empty', () => {
    expect(() => parseAllowedOrigins(undefined)).toThrow(/ALLOWED_ORIGIN/);
    expect(() => parseAllowedOrigins(' , ')).toThrow(/ALLOWED_ORIGIN/);
  });

  it('rejects the wildcard origin', () => {
    expect(() => parseAllowedOrigins('*')).toThrow(/\*/);
    expect(() => parseAllowedOrigins('https://a.mx,*')).toThrow(/\*/);
  });
});

describe('isSwaggerEnabled', () => {
  it('enables swagger only for allow-listed stages', () => {
    expect(isSwaggerEnabled('dev')).toBe(true);
    expect(isSwaggerEnabled('qa')).toBe(true);
  });

  it('disables swagger for prod, unknown or missing stages', () => {
    expect(isSwaggerEnabled('prod')).toBe(false);
    expect(isSwaggerEnabled('production')).toBe(false);
    expect(isSwaggerEnabled(undefined)).toBe(false);
  });
});

describe('applyHttpSecurity', () => {
  let app: INestApplication<App>;

  afterEach(async () => {
    await app?.close();
  });

  it('sets anti-clickjacking, CSP and no-store headers', async () => {
    app = await createApp(false);

    const res = await request(app.getHttpServer()).get('/ping').expect(200);

    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['content-security-policy']).toBe(
      "default-src 'none';frame-ancestors 'none'",
    );
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('does not disclose X-Powered-By', async () => {
    app = await createApp(false);

    const res = await request(app.getHttpServer()).get('/ping').expect(200);

    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('allows swagger assets and still forbids framing when swagger is enabled', async () => {
    app = await createApp(true);

    const res = await request(app.getHttpServer()).get('/ping').expect(200);
    const csp = res.headers['content-security-policy'];

    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it('echoes only allow-listed origins in CORS responses', async () => {
    app = await createApp(false);

    const allowed = await request(app.getHttpServer())
      .get('/ping')
      .set('Origin', ALLOWED);
    const foreign = await request(app.getHttpServer())
      .get('/ping')
      .set('Origin', 'https://evil.example');

    expect(allowed.headers['access-control-allow-origin']).toBe(ALLOWED);
    expect(foreign.headers['access-control-allow-origin']).toBeUndefined();
    expect(allowed.headers['access-control-allow-credentials']).toBeUndefined();
  });
});
