import { AuthController } from '../controllers/AuthController';
import express from 'express';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

const router = express.Router();

const UserRepository = AppDataSource.getRepository(User);
const userService = new UserService(UserRepository);
const authController = new AuthController(userService);

router.post('/register', (req: any, res) => {
  authController.register(req, res);
});

export default router;
