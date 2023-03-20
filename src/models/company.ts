import { Schema, model } from 'mongoose';
import { ICompany } from '../types';

const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
  },
  logoImg: String,
  themeColors: {
    primary: String,
    secondary: String,
    tertiary: String,
  },
});

const Company = model('Company', companySchema);

export default Company;
