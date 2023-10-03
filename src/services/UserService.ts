import createHttpError from 'http-errors';
import { User } from '../entity/User';
import { CreateUser } from '../types';
import { Repository } from 'typeorm';

export class UserService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password }: CreateUser) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (error) {
      const err = createHttpError(500, 'Internal Server Error');
      throw err;
    }
  }
}
