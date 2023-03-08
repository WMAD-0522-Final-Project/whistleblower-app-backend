import { Schema, model } from 'mongoose';
import { ILog } from '../types';

const logSchema = new Schema<ILog>({
  content: String,
  userId: Schema.Types.ObjectId,
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
});

logSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Log = model('Log', logSchema);

export default Log;
