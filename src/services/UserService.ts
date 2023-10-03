import { User } from '../entity/User';
import { CreateUser } from '../types';
import { Repository } from 'typeorm';

export class UserService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password }: CreateUser) {
    await this.userRepository.save({ firstName, lastName, email, password });
  }
}
