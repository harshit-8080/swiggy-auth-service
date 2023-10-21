import fs from 'fs';
import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import { RegisterUser } from '../types';
import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { JwtPayload, sign } from 'jsonwebtoken';
import path from 'path';
import createHttpError from 'http-errors';
import { CONFIG } from '../config/';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {
    this.userService = userService;
  }

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

      this.logger.info('New User created successfully', {
        id: user.id,
      });

      let privateKey: Buffer;
      try {
        privateKey = fs.readFileSync(
          path.resolve(
            __dirname,
            '../../certs/private.pem',
          ),
        );
      } catch (err) {
        const error = createHttpError(
          500,
          'Error while reading private key',
        );
        next(error);
        return;
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h',
        issuer: 'auth-service',
      });

      res.cookie('accessToken', accessToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      // Persist the refresh token
      const refreshTokenRepository =
        AppDataSource.getRepository(RefreshToken);

      const newRefreshToken =
        await refreshTokenRepository.save({
          user: user,
          expiresAt: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 365,
          ), // 1 Year
        });

      const refreshToken = sign(
        payload,
        CONFIG.REFRESH_SECRET_KEY!,
        {
          algorithm: 'HS256',
          expiresIn: '1y',
          issuer: 'auth-service',
          jwtid: String(newRefreshToken.id),
        },
      );

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
