import { Schema, model } from 'mongoose';
import { IClaimCategory } from '../types';

const claimCategorySchema = new Schema<IClaimCategory>({
  name: String,
});

const ClaimCategory = model('ClaimCategory', claimCategorySchema);

export default ClaimCategory;
