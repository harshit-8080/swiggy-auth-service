import { body } from 'express-validator';

export default [
  body('email').notEmpty().trim().withMessage('Email is required'),
  body('firstName')
    .notEmpty()
    .trim()
    .withMessage('firstName is required'),
  body('password').notEmpty().withMessage('password is required'),
];
