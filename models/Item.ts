import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IItem extends Document {
  restaurantId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  image: string;
  badge: 'new' | 'popular' | 'sold_out' | 'chef_special' | 'offer' | null;
  offerPrice: number | null;
  isAvailable: boolean;
  sortOrder: number;
  calories: number | null;
  allergens: string[];
  preparationMinutes: number | null;
}

const ItemSchema = new Schema<IItem>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  nameAr: { type: String, default: '' },
  description: { type: String, default: '' },
  descriptionAr: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  badge: { type: String, enum: ['new', 'popular', 'sold_out', 'chef_special', 'offer', null], default: null },
  offerPrice: { type: Number, default: null },
  isAvailable: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  calories: { type: Number, default: null },
  allergens: [{ type: String }],
  preparationMinutes: { type: Number, default: null },
});

ItemSchema.index({ restaurantId: 1, categoryId: 1, sortOrder: 1 });

export default (mongoose.models.Item as Model<IItem>) ||
  mongoose.model<IItem>('Item', ItemSchema);
