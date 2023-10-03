export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterUser extends CreateUser {
  body: CreateUser;
}
