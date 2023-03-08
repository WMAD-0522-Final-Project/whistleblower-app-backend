import { Schema, model } from 'mongoose';
import { IDepartment } from '../types';

const departmentSchema = new Schema<IDepartment>({
  name: String,
});

const Department = model('Department', departmentSchema);

export default Department;
