import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import { RegisterUser } from '../types';
import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../services/TokenService';

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
  ) {}

  async register(
    req: RegisterUser,
    res: Response,
    next: NextFunction,
  ) {
    // validate request body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res
        .status(400)
        .json({ errors: result.array() });
    }

    const { firstName, lastName, email, password } =
      req.body;

    this.logger.debug('New Request to Create User');

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });

      this.logger.info('New User created successfully');

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken =
        this.tokenService.generateAccessToken(payload);

      res.cookie('accessToken', accessToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      const newRefreshToken =
        await this.tokenService.persistRefreshToken(user);

      const refreshToken =
        this.tokenService.generateRefreshToken({
          ...payload,
          id: String(newRefreshToken.id),
        });

      res.cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
      return;
    }
  }
}
