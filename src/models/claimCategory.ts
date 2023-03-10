import { Schema, model } from 'mongoose';
import { IClaimCategory } from '../types';

const claimCategorySchema = new Schema<IClaimCategory>({
  name: {
    type: String,
    required: true,
  },
});

const ClaimCategory = model('ClaimCategory', claimCategorySchema);

export default ClaimCategory;
