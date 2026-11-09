/**
 * Express app factory: security headers, CORS, JSON body, `/api` router, static client (prod), error middleware.
 */
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from '@server/config/env.js';
import { errorMiddleware, httpLogger } from '@server/lib/index.js';
import apiRouter from '@server/routes/api.js';

/**
 * Parse comma-separated CORS origin list from environment config.
 */
function parseCorsOrigins(): string[] {
  return env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/** Platform probes (Render health checks poll these every few seconds). */
const RATE_LIMIT_EXEMPT_PATHS = new Set(['/api/health', '/api/ready']);

/**
 * True for health/readiness probes so they bypass the `/api` read limiter.
 * Uses `baseUrl + path` because, when mounted via `app.use('/api', …)`,
 * `req.path` is `/health` rather than `/api/health`.
 */
function isRateLimitExemptPath(req: express.Request): boolean {
  const fullPath = `${req.baseUrl}${req.path}`
    .replace(/\/+$/, '')
    .toLowerCase();
  return RATE_LIMIT_EXEMPT_PATHS.has(fullPath);
}

/**
 * Construct and configure the Express application instance.
 * Keep server startup concerns in `server.ts`.
 */
export function createApp(): express.Express {
  const app = express();
  // Trust one proxy hop in production (e.g. Render) so req.ip is the client
  // address rather than the proxy's, keeping IP-keyed rate limits per client.
  if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }
  const allowedOrigins = parseCorsOrigins();
  const apiReadRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    skip: isRateLimitExemptPath,
  });
  const apiWriteRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_WRITE_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  });
  const applyApiRateLimits = !env.E2E_RELAX_RATE_LIMIT;

  // Create paths for static directories.
  const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
  const uploadsStaticDir = new URL('public', import.meta.url).pathname;

  app.use(helmet());
  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
    }),
  );
  app.use(express.static(reactStaticDir));
  // Static directory for file uploads server/public/.
  app.use(express.static(uploadsStaticDir));
  app.use(httpLogger);
  app.use(express.json());
  if (applyApiRateLimits) {
    app.use('/api', apiReadRateLimiter);
    app.use('/api', (req, res, next) => {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        apiWriteRateLimiter(req, res, next);
        return;
      }
      next();
    });
  }

  app.use('/api', apiRouter);

  /*
   * Handles paths that aren't handled by any other route handler.
   * It responds with `index.html` to support page refreshes with React Router.
   * This must be the _last_ route, just before errorMiddleware.
   */
  app.get('/{*path}', (_req, res) =>
    res.sendFile(`${reactStaticDir}/index.html`),
  );

  app.use(errorMiddleware);

  return app;
}
