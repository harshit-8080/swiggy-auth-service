import { User } from '../../src/entity/User';
import app from '../../src/app';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { Roles } from '../../src/constants';
// import { isJwtValid } from '../utils';
// import { RefreshToken } from '../../src/entity/RefreshToken';
import createJWKSMock from 'mock-jwks';

describe('POST /auth/register', () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock('http://localhost:5501');
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    // Database Truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterEach(async () => {
    jwks.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given All Fields', () => {
    it('should return the 200 status code', async () => {
      const response = await request(app).get('/auth/whoAmI');
      expect(response.statusCode).toBe(200);
    });

    it('should return user data', async () => {
      const userData = {
        firstName: 'Harshit',
        lastName: 'Raj',
        email: 'harshit.new71@gmail.com',
        password: 'secret@123',
      };
      const userRepositoy = connection.getRepository(User);

      const data = await userRepositoy.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      const accessToken = jwks.token({
        sub: String(data.id),
        role: data.role,
      });

      const response = await request(app)
        .get('/auth/whoAmI')
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(response.body.id).toBe(data.id);
    });
  });
});
