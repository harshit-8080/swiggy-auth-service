import express, { Request, NextFunction, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { CreateUserRequest } from '../types';
import { logger } from '../config/logger';
import autheticate from '../middlewares/autheticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import { UserController } from '../controllers/UserControlller';
import { UserService } from '../services/UserService';
import { User } from '../entity/User';
import registerValidator from '../validators/register-validator';

const router = express.Router();

const UserRepository = AppDataSource.getRepository(User);
const userService = new UserService(UserRepository);
const userController = new UserController(userService, logger);

router.post(
  '/',
  autheticate,
  registerValidator,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) => {
    userController.create(req as CreateUserRequest, res, next);
  },
);

export default router;
