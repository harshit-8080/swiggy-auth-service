import { User } from '../../src/entity/User';
import app from '../../src/app';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
// import { truncateTables } from '../utils';
import { Roles } from '../../src/constants';
import { isJwtValid } from '../utils';
import { RefreshToken } from '../../src/entity/RefreshToken';

describe('POST /auth/register', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Database Truncate
    await connection.dropDatabase();
    await connection.synchronize();

    // await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given All Fields', () => {
    it('should return the 201 status code', async () => {
      // Arrange
      const userData = {
        firstName: 'Harshit',
        lastName: 'Raj',
        email: 'harshit.new71@gmail.com',
        password: 'secret@123',
      };

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it('should return valid json response', async () => {
      // Arrange
      const userData = {
        firstName: 'Harshit',
        lastName: 'Raj',
        email: 'harshit.new71@gmail.com',
        password: 'secret@123',
      };

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      // Assert
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
    });

    it('should create a new user', async () => {
      // Arrange
      const userData = {
        firstName: 'Harshit',
        lastName: 'Raj',
        email: 'harshit.new71@gmail.com',
        password: 'secret@123',
      };

      // Act
      await request(app).post('/auth/register').send(userData);

      // Assert
      const userRespository = connection.getRepository(User);
      const users = await userRespository.find();

      expect(users).toHaveLength(1);
      expect(users[0].firstName).toEqual(userData.firstName);
      expect(users[0].lastName).toEqual(userData.lastName);
      expect(users[0].email).toEqual(userData.email);
    });

    it('should assign a customer rol', async () => {
      // Arrange
      const userData = {
        firstName: 'Harshit',
        lastName: 'Raj',
        email: 'harshit.new71@gmail.com',
        password: 'secret@123',
      };

      // Act
      await request(app).post('/auth/register').send(userData);

      // Assert
      const userRespository = connection.getRepository(User);
      const users = await userRespository.find();

      expect(users).toHaveLength(1);
      expect(users[0]).toHaveProperty('role');
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it('should store hash password in database', async () => {
      // Arrange
      const userData = {
        firstName: 'Harshit',
        lastName: 'Raj',
        email: 'harshit.new71@gmail.com',
        password: 'secret@123',
      };

      // Act
      await request(app).post('/auth/register').send(userData);

      // Assert
      const userRespository = connection.getRepository(User);
      const users = await userRespository.find();

      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
    });

    it('should return 400 for duplicate email', async () => {
      // Arrange
      const userData = {
        firstName: 'Harshit',
        lastName: 'Raj',
        email: 'harshit.new71@gmail.com',
        password: 'secret@123',
      };

      const userRespository = connection.getRepository(User);
      await userRespository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(userData);
      const users = await userRespository.find();

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(users).toHaveLength(1);
    });

    it('should return accessToken and refreshToken in cookies', async () => {
      // Arrange
      const userData = {
        firstName: 'Harshit',
        lastName: 'Raj',
        email: 'harshit.new71@gmail.com',
        password: 'secret@123',
      };

      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      const cookies = response.headers['set-cookie'] || [];

      cookies.forEach((cookie: string) => {
        if (cookie.startsWith('accessToken=')) {
          accessToken = cookie.split(';')[0].split('=')[1];
        }
        if (cookie.startsWith('refreshToken=')) {
          refreshToken = cookie.split(';')[0].split('=')[1];
        }
      });

      // Assert
      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();

      expect(isJwtValid(accessToken)).toBeTruthy();
      expect(isJwtValid(refreshToken)).toBeTruthy();
    });

    it('should store the refresh token in the database', async () => {
      // Arrange
      const userData = {
        firstName: 'Harshit',
        lastName: 'Raj',
        email: 'harshit.new71@gmail.com',
        password: 'secret@123',
      };

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      // Assert

      const refreshTokenRepo = connection.getRepository(RefreshToken);

      const token = await refreshTokenRepo
        .createQueryBuilder('refreshToken')
        .where('refreshToken.userId=:userId', {
          userId: response.body.id,
        })
        .getMany();

      expect(token).toHaveLength(1);
    });
  });

  describe('Fields are missing and sanitized', () => {
    it('should return 400 status code if email is missing1', async () => {
      // Arrange
      const userData = {
        firstName: 'Madan',
        lastName: 'Singh',
        email: '',
        password: 'secret@123',
      };

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(userData);
      const userRespository = connection.getRepository(User);
      const users = await userRespository.find();

      // Assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it('should trim the email address', async () => {
      // Arrange
      const userData = {
        firstName: 'Harshit    ',
        lastName: 'Raj',
        email: '    harshit@gmail.com',
        password: 'secret@123',
      };

      // Act
      await request(app).post('/auth/register').send(userData);

      const userRespository = connection.getRepository(User);
      const users = await userRespository.find();

      // Assert
      expect(users[0].email).toBe('harshit@gmail.com');
      expect(users[0].firstName).toBe('Harshit');
    });
  });
});
