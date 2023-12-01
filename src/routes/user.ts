import express, {
  Request,
  NextFunction,
  Response,
  RequestHandler,
} from 'express';
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
    userController.create(
      req as CreateUserRequest,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.patch(
  '/:id',
  autheticate,
  canAccess([Roles.ADMIN]),
  updateUserValidator,
  (req: UpdateUserRequest, res: Response, next: NextFunction) => {
    userController.update(
      req,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.get(
  '/',
  autheticate,
  // canAccess([Roles.ADMIN]),
  (req, res, next) => {
    userController.getAll(
      req,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.get(
  '/:id',
  autheticate,
  canAccess([Roles.ADMIN]),
  (req, res, next) => {
    userController.getOne(
      req,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

router.delete(
  '/:id',
  autheticate,
  // canAccess([Roles.ADMIN]),
  (req, res, next) => {
    userController.destroy(
      req,
      res,
      next,
    ) as unknown as RequestHandler;
  },
);

export default router;
