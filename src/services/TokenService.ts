import { JwtPayload, sign } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import createHttpError from 'http-errors';
import { CONFIG } from '../config/';
import { RefreshToken } from '../entity/RefreshToken';
import { User } from '../entity/User';
import { Repository } from 'typeorm';

export class TokenService {
  constructor(
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  generateAccessToken(payload: JwtPayload) {
    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(
        path.resolve(__dirname, '../../certs/private.pem'),
      );
    } catch (err) {
      const error = createHttpError(
        500,
        'Error while reading private key',
      );
      throw error;
    }
    const accessToken = sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'auth-service',
    });

    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(
      payload,
      CONFIG.REFRESH_SECRET_KEY!,
      {
        algorithm: 'HS256',
        expiresIn: '1y',
        issuer: 'auth-service',
        jwtid: String(payload.id),
      },
    );

    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    const newRefreshToken =
      await this.refreshTokenRepository.save({
        user: user,
        expiresAt: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 365,
        ), // 1 Year
      });

    return newRefreshToken;
  }
}
