import { GetVerificationKey, expressjwt } from 'express-jwt';
import JwksClient from 'jwks-rsa';
import { CONFIG } from '../config/index';
import { Request } from 'express';

export default expressjwt({
  secret: JwksClient.expressJwtSecret({
    jwksUri: CONFIG.JWKS_URI!,
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,
  algorithms: ['RS256'],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(' ')[1].length == 0) {
      const token = authHeader.split(' ')[1];
      if (token) {
        return token;
      }
    }
    const { accessToken } = req.cookies;
    return accessToken;
  },
});
