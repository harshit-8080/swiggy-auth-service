import { UserService } from '../services/UserService';
import { RegisterUser } from '../types';
import { Response } from 'express';

export class AuthController {
  constructor(private userService: UserService) {
    this.userService = userService;
  }

  async register(req: RegisterUser, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    await this.userService.create({ firstName, lastName, email, password });

    res.status(201).json();
  }
}
