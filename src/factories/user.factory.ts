

import { User } from '../models/user/user.type.js';

export abstract class UserFactory {
  static extended(user: User): Partial<User> {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
