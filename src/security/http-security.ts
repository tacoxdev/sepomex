import { INestApplication } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import helmet, { HelmetOptions } from 'helmet';

// Stages en los que se publica Swagger. Cualquier otro valor (o ausencia) lo oculta.
const SWAGGER_STAGES = ['dev', 'qa'];
const WILDCARD_ORIGIN = '*';

export interface HttpSecurityOptions {
  allowedOrigins: string[];
  swaggerEnabled: boolean;
}

export function parseAllowedOrigins(raw: string | undefined): string[] {
  const origins = (raw ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.length === 0) {
    throw new Error(
      'ALLOWED_ORIGIN es obligatorio (lista de orígenes separados por coma).',
    );
  }
  if (origins.includes(WILDCARD_ORIGIN)) {
    throw new Error(
      `ALLOWED_ORIGIN no puede contener "${WILDCARD_ORIGIN}"; declare los orígenes permitidos.`,
    );
  }
  return origins;
}

export function isSwaggerEnabled(stage: string | undefined): boolean {
  return SWAGGER_STAGES.includes(stage ?? '');
}

// La API solo devuelve JSON: CSP estricta. Swagger UI necesita
// cargar sus scripts y estilos, por eso usa la política por defecto de helmet.
function buildCsp(
  swaggerEnabled: boolean,
): HelmetOptions['contentSecurityPolicy'] {
  if (swaggerEnabled) {
    return {
      directives: {
        frameAncestors: ["'none'"],
        // QA se publica por HTTP; HTTPS se fuerza en el proxy, no aquí.
        upgradeInsecureRequests: null,
      },
    };
  }
  return {
    useDefaults: false,
    directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
  };
}

function noStore(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('Cache-Control', 'no-store');
  next();
}

export function applyHttpSecurity(
  app: INestApplication,
  { allowedOrigins, swaggerEnabled }: HttpSecurityOptions,
): void {
  app.use(
    helmet({
      contentSecurityPolicy: buildCsp(swaggerEnabled),
      frameguard: { action: 'deny' },
    }),
  );
  app.use(noStore);
  app.enableCors({
    origin: allowedOrigins,
    credentials: false,
    methods: ['GET', 'OPTIONS'],
  });
}
