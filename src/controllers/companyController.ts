import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import AppError from '../error/AppError';
import { CompanyDetail } from '../types';
import { HttpStatusCode } from '../types/enums';
import Company from '../models/company';
import uploadFile from '../utils/uploadFile';
import { SERVER_TMP_DIRECTORY } from '../config/constants';
import Department from '../models/department';

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
    const company = (
      (await Company.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(companyId),
          },
        },
        {
          $lookup: {
            from: 'departments',
            foreignField: 'companyId',
            localField: '_id',
            as: 'departments',
            pipeline: [{ $project: { companyId: 0 } }],
          },
        },
      ])) as CompanyDetail[]
    )[0];

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
        message: 'Please upload logo image.',
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

export const createDepartment: RequestHandler = async (req, res, next) => {
  const { companyId } = req.userData!;
  const { name } = req.body;
  try {
    const department = await Department.create({
      name,
      companyId,
    });
    return res.status(HttpStatusCode.OK).json({
      message: 'Department created successfully!',
      department,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDepartment: RequestHandler = async (req, res, next) => {
  const { companyId } = req.userData!;

  try {
    const department = await Department.findOne({ companyId });
    if (!department) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Department with provided id not found.',
      });
    }

    await department.deleteOne({ companyId });

    return res.status(HttpStatusCode.OK).json({
      message: 'Department deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};
