import app from '../../src/app';
import request from 'supertest';

describe('POST /auth/register', () => {
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
      const response = await request(app).post('/auth/register').send(userData);

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
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
    });
  });
});
