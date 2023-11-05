import { NextFunction, Response } from 'express';
import { TenantService } from '../services/TenantService';
import { CreateTenantRequest, IUpdate } from '../types';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { Request } from 'express-jwt';
import createHttpError from 'http-errors';

export class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger,
  ) {}

  async create(
    req: CreateTenantRequest,
    res: Response,
    next: NextFunction,
  ) {
    // validate request body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const { name, address } = req.body;

      this.logger.debug('New Request to create tenant', {
        name,
        address,
      });

      const tenant = await this.tenantService.create({
        name,
        address,
      });

      this.logger.info('New Tenant Created', { id: tenant.id });
      return res.status(201).json(tenant);
    } catch (error) {
      console.log(error);
      next(error);
      return;
    }
  }

  async getTenants(res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantService.getAllTenants();
      return res.status(200).json(tenants);
    } catch (error) {
      next(error);
      return;
    }
  }

  async getTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = await this.tenantService.getTenant(
        Number(req.params.tenantId),
      );
      if (!tenant) {
        const error = createHttpError(404, 'Tenant not found');
        next(error);
        return;
      }
      return res.status(200).json(tenant);
    } catch (error) {
      next(error);
      return;
    }
  }

  async deleteTenant(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const tenant = await this.tenantService.deleteTenantById(
        Number(req.params.tenantId),
      );

      console.log(tenant);

      if (tenant.affected == 0) {
        const error = createHttpError(404, 'Tenant not found');
        next(error);
        return;
      }
      return res
        .status(200)
        .json({ message: 'Tenant deleted successfully' });
    } catch (error) {
      next(error);
      return;
    }
  }

  async updateTenant(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // validate request body
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const updateData: IUpdate = req.body;
      await this.tenantService.updateTenant(
        Number(req.params.tenantId),
        updateData,
      );

      return res
        .status(200)
        .json({ message: 'Tenant updated successfully' });
    } catch (error) {
      next(error);
      return;
    }
  }
}
