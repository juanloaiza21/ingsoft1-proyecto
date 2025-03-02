import { Role } from '../enums/role.enum';

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  name: string;
  role: Role;
  password: string;
  birthDate: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}
