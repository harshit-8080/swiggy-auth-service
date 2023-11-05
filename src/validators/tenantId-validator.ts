import { param } from 'express-validator';

export default [
  param('tenantId')
    .isString()
    .trim()
    .withMessage('tenanatId is required'),
];
