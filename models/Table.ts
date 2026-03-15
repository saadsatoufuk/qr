import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITable extends Document {
  restaurantId: Types.ObjectId;
  tableNumber: string;
  label: string;
  capacity: number;
  qrCodeDataUrl: string;
  qrTargetUrl: string;
  isActive: boolean;
  createdAt: Date;
}

const TableSchema = new Schema<ITable>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  tableNumber: { type: String, required: true },
  label: { type: String, default: '' },
  capacity: { type: Number, default: 4 },
  qrCodeDataUrl: { type: String, default: '' },
  qrTargetUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

TableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });

export default (mongoose.models.Table as Model<ITable>) ||
  mongoose.model<ITable>('Table', TableSchema);
