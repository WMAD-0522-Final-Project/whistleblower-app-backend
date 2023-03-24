import { RequestHandler } from 'express';
import AppError from '../error/AppError';
import { HttpStatusCode } from '../types/enums';
import Company from '../models/company';

export const createCompany: RequestHandler = async (req, res, next) => {
  const { name, logoImg, themeColors } = req.body;
  try {
    const company = await Company.create({ name, logoImg, themeColors });
    return res.status(HttpStatusCode.OK).json({
      message: 'Company created successfully!',
      company,
    });
  } catch (err) {
    next(err);
  }
};

export const updateLogoImg: RequestHandler = (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
