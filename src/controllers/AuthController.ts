import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import { RegisterUser } from '../types';
import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {
    this.userService = userService;
  }

  async register(req: RegisterUser, res: Response, next: NextFunction) {
    // validate request body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    this.logger.debug('New Request to Create User', {
      firstName,
      lastName,
      email,
      password: '*******',
    });
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });

      this.logger.info('New User created successfully', { id: user.id });

      res.status(201).json();
    } catch (error) {
      next(error);
      return;
    }
  }
}
