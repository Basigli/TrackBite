import Document from 'mongoose';

export interface Diet extends Document {
  id?: number, 
  name: string,
  caloriesAmount: number, 
}
