import { AuthController } from '../controllers/AuthController';
import express, { NextFunction, Response } from 'express';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { logger } from '../config/logger';
import registerValidator from '../validators/register-validator';
import loginValidator from '../validators/login-validator';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entity/RefreshToken';
import { CredentialService } from '../services/CredentialService';

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
    authController.register(req, res, next);
  },
);

router.post(
  '/login',
  loginValidator,
  (req: any, res: Response, next: NextFunction) => {
    authController.login(req, res, next);
  },
);

router.get(
  '/whoAmI',
  (req: any, res: Response, next: NextFunction) => {
    authController.whoAmI(req, res, next);
  },
);
export default router;
