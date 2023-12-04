import createHttpError from 'http-errors';
import { User } from '../entity/User';
import { CreateUser, LimitedUserData } from '../types';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

export class UserService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async create({
    firstName,
    lastName,
    email,
    password,
    role,
    tenantId,
  }: CreateUser) {
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
        role: role,
        tenantId: tenantId ? { id: tenantId } : tenantId,
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

  async findByEmailWithPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'password',
      ],
    });

    return user;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }

  async update(
    userId: number,
    { firstName, lastName, role }: LimitedUserData,
  ) {
    try {
      return await this.userRepository.update(userId, {
        firstName,
        lastName,
        role,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        'Failed to update the user in the database',
      );
      throw error;
    }
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async deleteById(userId: number) {
    return await this.userRepository.delete(userId);
  }
}
