import createHttpError from 'http-errors';
import { Repository } from 'typeorm';
import { Tenant } from '../entity/Tenant';
import { ITenant } from '../types';

export class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {
    this.tenantRepository = tenantRepository;
  }

  async create(tenantDate: ITenant) {
    try {
      return await this.tenantRepository.save(tenantDate);
    } catch (error) {
      const err = createHttpError(500, 'Internal Server Error');
      throw err;
    }
  }
}
