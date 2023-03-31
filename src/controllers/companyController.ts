import { RequestHandler } from 'express';
import AppError from '../error/AppError';
import { HttpStatusCode } from '../types/enums';
import Company from '../models/company';
import uploadFile from '../utils/uploadFile';
import { SERVER_TMP_DIRECTORY } from '../config/constants';

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

export const getCompanyInfo: RequestHandler = async (req, res, next) => {
  const { companyId } = req.userData!;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Company with provided Id not found.',
      });
    }
    return res.status(HttpStatusCode.OK).json({
      company,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCompanyInfo: RequestHandler = async (req, res, next) => {
  const { companyId } = req.userData!;
  const { name, themeColors } = req.body;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Company with provided Id not found.',
      });
    }

    if (name) company.name = name;
    if (themeColors) {
      const { primary, secondary, tertiary } = themeColors;
      if (primary) company.themeColors.primary = primary;
      if (secondary) company.themeColors.secondary = secondary;
      if (tertiary) company.themeColors.tertiary = tertiary;
    }

    await company.save();

    return res.status(HttpStatusCode.OK).json({
      message: 'Company updated successfully!',
      company,
    });
  } catch (err) {
    next(err);
  }
};

export const updateLogoImg: RequestHandler = async (req, res, next) => {
  const { companyId } = req.userData!;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Company with provided Id not found.',
      });
    }

    if (!req.file) {
      throw new AppError({
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Please upload profile image.',
      });
    }

    const { url } = await uploadFile(
      `/${SERVER_TMP_DIRECTORY}/${req.file.filename}`,
      company._id.toHexString(),
      'company'
    );

    company.logoImg = url;
    await company.save();

    return res.status(HttpStatusCode.OK).json({
      message: 'Company Logo updated successfully!',
    });
  } catch (err) {
    next(err);
  }
};
