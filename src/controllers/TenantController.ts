import { NextFunction, Response } from 'express';
import { TenantService } from '../services/TenantService';
import { CreateTenantRequest } from '../types';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';

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
}
