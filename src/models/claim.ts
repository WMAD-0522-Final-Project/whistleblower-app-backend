import { Schema, model } from 'mongoose';
import { IClaim, ClaimStatus } from '../types';

const claimSchema = new Schema<IClaim>({
  inChargeAdminIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  title: String,
  status: {
    type: String,
    enum: ClaimStatus,
    default: ClaimStatus.Unhandled,
  },
  categoryIds: [{ type: Schema.Types.ObjectId, ref: 'ClaimCategory' }],
  hasNewComment: Boolean,
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

claimSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Claim = model('Claim', claimSchema);

export default Claim;
