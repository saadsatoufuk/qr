import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOrderItem {
  itemId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

export interface IOrder extends Document {
  restaurantId: Types.ObjectId;
  orderNumber: string;
  tableId: Types.ObjectId;
  tableNumber: string;
  tableLabel: string;
  customerName: string | null;
  items: IOrderItem[];
  subtotal: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card';
  notes: string;
  rating: number | null;
  ratingComment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  notes: { type: String, default: '' },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  orderNumber: { type: String, required: true },
  tableId: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
  tableNumber: { type: String, required: true },
  tableLabel: { type: String, default: '' },
  customerName: { type: String, default: null },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
  notes: { type: String, default: '' },
  rating: { type: Number, default: null, min: 1, max: 5 },
  ratingComment: { type: String, default: null },
}, { timestamps: true });

OrderSchema.index({ restaurantId: 1, status: 1 });
OrderSchema.index({ restaurantId: 1, createdAt: -1 });

export default (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>('Order', OrderSchema);
