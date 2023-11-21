import express, { Request, NextFunction, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { CreateUserRequest, UpdateUserRequest } from '../types';
import { logger } from '../config/logger';
import autheticate from '../middlewares/autheticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import { UserController } from '../controllers/UserControlller';
import { UserService } from '../services/UserService';
import { User } from '../entity/User';
import registerValidator from '../validators/register-validator';
import updateUserValidator from '../validators/update-user-validator';

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

router.patch(
  '/:id',
  autheticate,
  canAccess([Roles.ADMIN]),
  updateUserValidator,
  (req: UpdateUserRequest, res: Response, next: NextFunction) => {
    userController.update(req, res, next);
  },
);

router.get(
  '/',
  autheticate,
  canAccess([Roles.ADMIN]),
  (req, res, next) => {
    userController.getAll(req, res, next);
  },
);

router.get(
  '/:id',
  autheticate,
  canAccess([Roles.ADMIN]),
  (req, res, next) => {
    userController.getOne(req, res, next);
  },
);

router.delete(
  '/:id',
  autheticate,
  canAccess([Roles.ADMIN]),
  (req, res, next) => {
    userController.destroy(req, res, next);
  },
);

export default router;
