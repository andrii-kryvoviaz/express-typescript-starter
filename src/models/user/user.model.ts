import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { User } from './user.type.js';

const userScheme = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['REGULAR', 'ADMIN'],
      default: 'REGULAR',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

userScheme.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userScheme.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const UserModel = mongoose.model<
  User & {
    matchPassword: (password: string) => Promise<boolean>;
  }
>('User', userScheme);
