import { expressjwt } from 'express-jwt';
import { CONFIG } from '../config';
import { Request } from 'express';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';
import { logger } from '../config/logger';

export default expressjwt({
  secret: CONFIG.REFRESH_SECRET_KEY!,
  algorithms: ['HS256'],
  getToken(req: Request) {
    const { refreshToken } = req.cookies;
    return refreshToken;
  },
  async isRevoked(request: Request, token: any) {
    try {
      const refreshTokenRepo =
        AppDataSource.getRepository(RefreshToken);

      const refreshToken = await refreshTokenRepo.findOne({
        where: {
          id: token.payload.id,
          user: { id: token?.payload.sub },
        },
      });

      return refreshToken == null;
    } catch (error) {
      logger.error('error while refresh token: ', {
        id: token.payload.id,
      });
    }

    return true;
  },
});
