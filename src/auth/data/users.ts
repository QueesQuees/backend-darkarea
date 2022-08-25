import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';

export const users: UserEntity[] = [
  {
    id: '3213213',
    fullName: 'John',
    email: 'foo@bar.com',
    isActive: true,
    password: bcrypt.hashSync('admin@123', 10),
    phoneNumber: '0123456789',
    username: 'footbar',
  },
];
