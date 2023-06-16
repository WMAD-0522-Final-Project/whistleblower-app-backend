import { Schema, model } from 'mongoose';
import { ILabel } from '../types';

const labelSchema = new Schema<ILabel>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
});

const Label = model('Label', labelSchema);

export default Label;
