import { UserDocument } from 'src/users/entities/user.entity';

export class UserResponse {
  user: UserDocument;
  token: string;
}
