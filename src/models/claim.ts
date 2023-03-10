import { Schema, model } from 'mongoose';
import { IClaim } from '../types';
import { ClaimStatus } from '../types/enums';

const claimSchema = new Schema<IClaim>({
  inChargeAdminIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ClaimStatus,
    default: ClaimStatus.Unhandled,
  },
  categoryIds: [{ type: Schema.Types.ObjectId, ref: 'ClaimCategory' }],
  hasNewComment: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Number, default: () => Date.now() },
});

claimSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Claim = model('Claim', claimSchema);

export default Claim;
