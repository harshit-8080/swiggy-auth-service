import { expressjwt } from 'express-jwt';
import { CONFIG } from '../config';
import { Request } from 'express';

export default expressjwt({
  secret: CONFIG.REFRESH_SECRET_KEY!,
  algorithms: ['HS256'],
  getToken(req: Request) {
    const { refreshToken } = req.cookies;
    return refreshToken;
  },
});
