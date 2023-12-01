import 'reflect-metadata';
import express, { Request, RequestHandler, Response } from 'express';
import cors from 'cors';
import { HttpError } from 'http-errors';
import { logger } from './config/logger';
import authRouter from './routes/auth';
import tenantRouter from './routes/tenant';
import userRouter from './routes/user';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res
    .status(200)
    .json({ response: 'Home RouteE' }) as unknown as RequestHandler;
});

app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);
app.use('/users', userRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: Request, res: Response) => {
  logger.error(err.message);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    name: err.name,
    statusCode: err.statusCode,
    message: err.message,
    details: [],
  });
});

export default app;
