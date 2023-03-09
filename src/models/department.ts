import { Schema, model } from 'mongoose';
import { IDepartment } from '../types';

const departmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: true,
  },
});

const Department = model('Department', departmentSchema);

export default Department;
