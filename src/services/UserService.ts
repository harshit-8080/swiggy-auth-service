import createHttpError from 'http-errors';
import { User } from '../entity/User';
import { CreateUser } from '../types';
import { Repository } from 'typeorm';
import { Roles } from '../constants';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password }: CreateUser) {
    // hash the password
    const saltRound: number = 10;
    const hashedPassword: string = await bcrypt.hash(
      password,
      saltRound,
    );
    const checkForDuplicateUser = await this.userRepository.findOne({
      where: { email },
    });
    if (checkForDuplicateUser) {
      const err = createHttpError(401, 'User Already Exists');
      throw err;
    }
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: Roles.CUSTOMER,
      });
    } catch (error) {
      const err = createHttpError(500, 'Internal Server Error');
      throw err;
    }
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }
}
