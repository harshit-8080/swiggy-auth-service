import { body } from 'express-validator';

export default [body('name').trim(), body('address').trim()];
