import { Schema, model } from 'mongoose';
import { IPermission } from '../types';

const permissionSchema = new Schema<IPermission>({
  name: {
    type: String,
    required: true,
  },
});

const Permission = new Schema<IPermission>({
  name: String,
});

export default Permission;
