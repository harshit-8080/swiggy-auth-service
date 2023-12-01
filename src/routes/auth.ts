import { AuthController } from '../controllers/AuthController';
import express, {
  Request,
  NextFunction,
  Response,
  RequestHandler,
} from 'express';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { logger } from '../config/logger';
import registerValidator from '../validators/register-validator';
import loginValidator from '../validators/login-validator';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entity/RefreshToken';
import { CredentialService } from '../services/CredentialService';
import autheticate from '../middlewares/autheticate';
import { RegisterUser, AuthRequest } from '../types';
import validateRefreshToken from '../middlewares/validateRefreshToken';
import parseRefreshToken from '../middlewares/parseRefreshToken';

const router = express.Router();

const UserRepository = AppDataSource.getRepository(User);
const RefreshTokenRepository =
  AppDataSource.getRepository(RefreshToken);

const userService = new UserService(UserRepository);
const tokenService = new TokenService(RefreshTokenRepository);
const credentialService = new CredentialService();

const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService,
);

router.post(
  '/register',
  registerValidator,
  (req: any, res: Response, next: NextFunction) => {
    authController.register(
      req as RegisterUser,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.post(
  '/login',
  loginValidator,
  (req: Request, res: Response, next: NextFunction) => {
    authController.login(req, res, next) as unknown as RequestHandler;
  },
);

router.get(
  '/whoAmI',
  autheticate,
  (req: Request, res: Response, next: NextFunction) => {
    authController.whoAmI(
      req as AuthRequest,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.post(
  '/refresh',
  validateRefreshToken,
  (req: Request, res: Response, next: NextFunction) => {
    authController.refresh(
      req as AuthRequest,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.get(
  '/logout',
  parseRefreshToken,
  (req: Request, res: Response, next: NextFunction) => {
    authController.logout(
      req as AuthRequest,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);
export default router;
