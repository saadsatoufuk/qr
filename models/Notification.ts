import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface INotification extends Document {
  restaurantId: Types.ObjectId;
  type: 'new_order' | 'order_cancelled';
  title: string;
  body: string;
  orderId: Types.ObjectId;
  tableNumber: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  type: { type: String, enum: ['new_order', 'order_cancelled'], required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  tableNumber: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ restaurantId: 1, isRead: 1, createdAt: -1 });

export default (mongoose.models.Notification as Model<INotification>) ||
  mongoose.model<INotification>('Notification', NotificationSchema);
