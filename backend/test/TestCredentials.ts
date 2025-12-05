import bcrypt from 'bcryptjs';

const User = {
  nickname: "testuser",
  mail: "testuser@example.com",
  password: "testpassword"
};

const hashedPassword = await bcrypt.hash(User.password, 10);
const UserCredentials = {
  nickname: "testuser",
  passwordHash: hashedPassword
};
export { User, UserCredentials };