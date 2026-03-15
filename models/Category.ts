import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICategory extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  nameAr: string;
  emoji: string;
  sortOrder: number;
  isVisible: boolean;
}

const CategorySchema = new Schema<ICategory>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  nameAr: { type: String, default: '' },
  emoji: { type: String, default: '🍽️' },
  sortOrder: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
});

CategorySchema.index({ restaurantId: 1, sortOrder: 1 });

export default (mongoose.models.Category as Model<ICategory>) ||
  mongoose.model<ICategory>('Category', CategorySchema);
