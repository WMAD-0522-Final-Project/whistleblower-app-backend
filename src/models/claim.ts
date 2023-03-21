import { Schema, model } from 'mongoose';
import { IClaim } from '../types';
import { ClaimStatus } from '../types/enums';

const claimSchema = new Schema<IClaim>({
  inChargeAdmins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ClaimStatus,
    default: ClaimStatus.Unhandled,
  },
  categories: [{ type: Schema.Types.ObjectId, ref: 'ClaimCategory' }],
  hasNewComment: {
    type: Boolean,
    default: false,
  },
  labels: [{ type: Schema.Types.ObjectId, ref: ' Label' }],
  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() },
});

claimSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Claim = model('Claim', claimSchema);

export default Claim;
