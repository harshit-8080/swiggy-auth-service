import { AuthController } from '../controllers/AuthController';
import express from 'express';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { logger } from '../config/logger';

const router = express.Router();

const UserRepository = AppDataSource.getRepository(User);
const userService = new UserService(UserRepository);
const authController = new AuthController(userService, logger);

router.post('/register', (req: any, res, next) => {
  authController.register(req, res, next);
});

export default router;
