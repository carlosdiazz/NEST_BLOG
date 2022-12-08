import { Request } from 'express';
import { User } from './../../components/users/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
