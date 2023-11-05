import express, { Request, NextFunction, Response } from 'express';
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/TenantService';
import { Tenant } from '../entity/Tenant';
import { AppDataSource } from '../config/data-source';
import { CreateTenantRequest } from '../types';
import { logger } from '../config/logger';
import autheticate from '../middlewares/autheticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import createTenantValidator from '../validators/create-tenant-validator';

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
  '/',
  autheticate,
  canAccess([Roles.ADMIN]),
  createTenantValidator,
  (req: Request, res: Response, next: NextFunction) => {
    tenantController.create(req as CreateTenantRequest, res, next);
  },
);

export default router;
