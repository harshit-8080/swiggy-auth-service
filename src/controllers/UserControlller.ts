import { NextFunction, Response } from 'express';
import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import { CreateUserRequest } from '../types';
import { Roles } from '../constants/index';

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async create(
    req: CreateUserRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.MANAGER,
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}
