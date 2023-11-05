import createHttpError from 'http-errors';
import { Repository } from 'typeorm';
import { Tenant } from '../entity/Tenant';
import { ITenant, IUpdate } from '../types';

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

  async getAllTenants() {
    try {
      return await this.tenantRepository.find({});
    } catch (error) {
      const err = createHttpError(500, 'Internal Server Error');
      throw err;
    }
  }

  async getTenant(tenantId: number) {
    try {
      return await this.tenantRepository.findOne({
        where: { id: tenantId },
      });
    } catch (error) {
      const err = createHttpError(500, 'Internal Server Error');
      throw err;
    }
  }

  async deleteTenantById(tenantId: number) {
    try {
      return await this.tenantRepository.delete({ id: tenantId });
    } catch (error) {
      const err = createHttpError(500, 'Internal Server Error');
      throw err;
    }
  }

  async updateTenant(tenantId: number, updateData: IUpdate) {
    try {
      await this.tenantRepository
        .createQueryBuilder()
        .update(Tenant)
        .set(updateData)
        .where('id = :id', { id: tenantId })
        .execute();
    } catch (error) {
      const err = createHttpError(500, 'Internal Server Error');
      throw err;
    }
  }
}
