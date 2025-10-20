import Document from 'mongoose';

export interface Nutrient extends Document {
    id?: number,
    name: string,
    unit: string,
    totalAmount: number
    amount100g: number
}