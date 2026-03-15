import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  description: string;
  primaryColor: string;
  address: string;
  isOpen: boolean;
  currency: string;
  currencySymbol: string;
  estimatedWaitMinutes: number;
  adminEmail: string;
  adminPasswordHash: string;
  createdAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  description: { type: String, default: '' },
  primaryColor: { type: String, default: '#D4A853' },
  address: { type: String, default: '' },
  isOpen: { type: Boolean, default: true },
  currency: { type: String, default: 'SAR' },
  currencySymbol: { type: String, default: 'ر.س' },
  estimatedWaitMinutes: { type: Number, default: 15 },
  adminEmail: { type: String, required: true, unique: true },
  adminPasswordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default (mongoose.models.Restaurant as Model<IRestaurant>) ||
  mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
