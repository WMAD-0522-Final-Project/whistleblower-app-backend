import { Schema, model } from 'mongoose';
import { ICommentMessage } from '../types';

const commentMessageSchema = new Schema<ICommentMessage>({
  claimId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  message: String,
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
});

commentMessageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const CommentMessage = model('CommentMessage', commentMessageSchema);

export default CommentMessage;
