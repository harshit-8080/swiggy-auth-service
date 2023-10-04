import { body } from 'express-validator';

export default [
  body('email').notEmpty().withMessage('Email is required'),
  body('firstName').notEmpty().withMessage('firstName is required'),
  body('password').notEmpty().withMessage('password is required'),
];
