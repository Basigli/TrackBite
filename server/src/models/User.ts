import Document from 'mongoose';
export interface User extends Document {
  id?: number,
  nickname: string,
  mail: string
}
