import { body } from 'express-validator';

export default [
  body('name').notEmpty().trim().withMessage('name is required'),
  body('address')
    .notEmpty()
    .trim()
    .withMessage('address is required'),
];
