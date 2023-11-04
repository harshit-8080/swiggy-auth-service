import { Request } from 'express';

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterUser extends CreateUser {
  body: CreateUser;
}

export interface AuthCookie {
  accessToken: string;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: number;
    id?: string;
  };
}

export interface ITenant {
  name: string;
  address: string;
}

export interface CreateTenantRequest extends Request {
  body: ITenant;
}
