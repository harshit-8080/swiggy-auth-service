import { Request } from 'express';

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
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
    role: string;
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

export interface IUpdate {
  name?: string;
  address?: string;
}

export interface CreateUserRequest extends Request {
  body: CreateUser;
}

export interface LimitedUserData {
  firstName: string;
  lastName: string;
  role: string;
}

export interface UpdateUserRequest extends Request {
  body: LimitedUserData;
}
