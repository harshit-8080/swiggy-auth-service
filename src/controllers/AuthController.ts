import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import { AuthRequest, RegisterUser } from '../types';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../services/TokenService';
import createHttpError from 'http-errors';
import { CredentialService } from '../services/CredentialService';

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService,
  ) {}

  async register(
    req: RegisterUser,
    res: Response,
    next: NextFunction,
  ) {
    // validate request body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { firstName, lastName, email, password } = req.body;

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

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      res.cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      res.status(201).json({ ...user, password: undefined });
    } catch (error) {
      next(error);
      return;
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    // validate request body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const { email, password } = req.body;
      this.logger.debug('new request to login a user', { email });

      const user = await this.userService.findByEmail(email);

      if (!user) {
        const error = createHttpError(
          400,
          'email and password does not match',
        );
        next(error);
        return;
      }

      const passwordMatch =
        await this.credentialService.comparePassword(
          password,
          user.password,
        );

      if (!passwordMatch) {
        const error = createHttpError(
          400,
          'email and password does not match',
        );
        next(error);
        return;
      }

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

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      res.cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      this.logger.info('User has been logged in', { id: user.id });
      res.status(200).json({ id: user.id });
    } catch (error) {
      next(error);
      return;
    }
  }

  async whoAmI(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(
        Number(req.auth.sub),
      );
      res.status(200).json({ ...user, password: undefined });
    } catch (error) {
      next(error);
      return;
    }
  }
}
