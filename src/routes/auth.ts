import { AuthController } from '../controllers/AuthController';
import express, { NextFunction, Response } from 'express';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { logger } from '../config/logger';
import registerValidator from '../validators/register-validator';

const router = express.Router();

const UserRepository = AppDataSource.getRepository(User);
const userService = new UserService(UserRepository);
const authController = new AuthController(userService, logger);

router.post(
  '/register',
  registerValidator,
  (req: any, res: Response, next: NextFunction) => {
    authController.register(req, res, next);
  },
);

export default router;
