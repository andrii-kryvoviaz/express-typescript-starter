import { Types } from 'mongoose';

export type User = {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  status: UserStatus;
};

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED';
export type UserRole = 'REGULAR' | 'ADMIN';
