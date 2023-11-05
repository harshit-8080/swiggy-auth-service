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
import tenantIdValidator from '../validators/tenantId-validator';
import updateValidator from '../validators/update-validator';

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

router.get(
  '/',
  autheticate,
  (req: Request, res: Response, next: NextFunction) => {
    tenantController.getTenants(res, next);
  },
);

router.get(
  '/:tenantId',
  autheticate,
  tenantIdValidator,
  (req: Request, res: Response, next: NextFunction) => {
    tenantController.getTenant(req, res, next);
  },
);

router.delete(
  '/:tenantId',
  autheticate,
  (req: Request, res: Response, next: NextFunction) => {
    tenantController.deleteTenant(req, res, next);
  },
);

router.patch(
  '/:tenantId',
  autheticate,
  updateValidator,
  (req: Request, res: Response, next: NextFunction) => {
    tenantController.updateTenant(req, res, next);
  },
);

export default router;
