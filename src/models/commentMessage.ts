import { Schema, model } from 'mongoose';
import { ICommentMessage } from '../types';

const commentMessageSchema = new Schema<ICommentMessage>({
  claimId: {
    type: Schema.Types.ObjectId,
    ref: 'Claim',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
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
