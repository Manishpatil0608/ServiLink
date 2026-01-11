import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errors as celebrateErrors } from 'celebrate';
import { env } from './config/env.js';
import { router } from './router/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './utils/appError.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: env.rateLimit.windowMs, max: env.rateLimit.max, standardHeaders: true, legacyHeaders: false }));

app.get('/health/live', (req, res) => res.json({ status: 'ok' }));
app.get('/health/ready', (req, res) => res.json({ status: 'ready' }));

app.use('/api/v1', router);
app.use((req, res, next) => next(new AppError('Route not found', 404, 'NOT_FOUND')));
app.use(celebrateErrors());
app.use(errorHandler);

export default app;
