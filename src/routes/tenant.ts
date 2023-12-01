import express, {
  Request,
  NextFunction,
  Response,
  RequestHandler,
} from 'express';
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
    tenantController.create(
      req as CreateTenantRequest,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  tenantController.getTenants(res, next) as unknown as RequestHandler;
});

router.get(
  '/:tenantId',
  autheticate,
  canAccess([Roles.ADMIN]),
  tenantIdValidator,
  (req: Request, res: Response, next: NextFunction) => {
    tenantController.getTenant(
      req,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.delete(
  '/:tenantId',
  autheticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) => {
    tenantController.deleteTenant(
      req,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.patch(
  '/:tenantId',
  autheticate,
  canAccess([Roles.ADMIN]),
  updateValidator,
  (req: Request, res: Response, next: NextFunction) => {
    tenantController.updateTenant(
      req,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

export default router;
