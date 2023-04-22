import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import Claim from '../models/claim';
import AppError from '../error/AppError';
import { HttpStatusCode } from '../types/enums';
import Label from '../models/label';
import ClaimCategory from '../models/claimCategory';
import CommentMessage from '../models/commentMessage';
import { ClaimDetail, IClaim } from '../types';
import Log from '../models/log';

export const getClaimList: RequestHandler = async (req, res, next) => {
  const { status } = req.query;
  const { companyId } = req.userData!;
  try {
    let claims;
    if (status === undefined) {
      claims = await Claim.find({ companyId });
    } else {
      claims = await Claim.aggregate([
        { $match: { status, companyId: new Types.ObjectId(companyId) } },
        { $project: { title: 1, createdAt: 1, inChargeAdmins: 1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'inChargeAdmins',
            foreignField: '_id',
            as: 'inChargeAdmins',
            pipeline: [
              { $project: { profileImg: 1, firstName: 1, lastName: 1 } },
            ],
          },
        },
      ]);
    }

    return res.status(HttpStatusCode.OK).json({
      claims,
    });
  } catch (err) {
    next(err);
  }
};

export const getClaimDetail: RequestHandler = async (req, res, next) => {
  const { claimId } = req.params;
  try {
    const isClaimExist = await Claim.findById(claimId);
    if (!isClaimExist) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Claim with provided id not found.',
      });
    }

    const claim = (
      (await Claim.aggregate([
        { $match: { _id: new Types.ObjectId(claimId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'inChargeAdmins',
            foreignField: '_id',
            as: 'inChargeAdmins',
            pipeline: [
              { $project: { profileImg: 1, firstName: 1, lastName: 1 } },
            ],
          },
        },
        {
          $lookup: {
            from: 'labels',
            localField: 'labels',
            foreignField: '_id',
            as: 'labels',
            pipeline: [{ $project: { companyId: 0 } }],
          },
        },
        {
          $lookup: {
            from: 'claimcategories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
      ])) as ClaimDetail[]
    )[0];

    return res.status(HttpStatusCode.OK).json({
      claim,
    });
  } catch (err) {
    next(err);
  }
};

export const createClaim: RequestHandler = async (req, res, next) => {
  const { title, body, category } = req.body;
  const { isAnonymous } = req.query;
  const { companyId, _id: createUserId } = req.userData!;
  try {
    let claim: IClaim;
    if (JSON.parse(isAnonymous as string)) {
      claim = await Claim.create({
        title,
        body,
        category,
        companyId,
      });
    } else {
      claim = await Claim.create({
        title,
        body,
        category,
        companyId,
        createUserId,
      });
    }

    return res.status(HttpStatusCode.CREATED).json({
      message: 'New claim created successfully!',
      claim,
    });
  } catch (err) {
    next(err);
  }
};

export const assignInChargeAdmin: RequestHandler = async (req, res, next) => {
  const { claimId } = req.params;
  const { inChargeAdmins } = req.body;
  try {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Claim with provided id not found.',
      });
    }

    claim.inChargeAdmins = inChargeAdmins;
    await claim.save();

    return res.status(HttpStatusCode.OK).json({
      message: "Claim's assigned admin changed succsessfully!",
      inChargeAdmins: claim.inChargeAdmins,
    });
  } catch (err) {
    next(err);
  }
};

export const changeClaimStatus: RequestHandler = async (req, res, next) => {
  const { claimId } = req.params;
  const { status } = req.body;
  const { _id: userId, firstName, lastName, companyId } = req.userData!;

  try {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Claim with provided id not found.',
      });
    }
    let prevStatus = claim.status;
    claim.status = status;
    await claim.save();

    const logContent = `${firstName} ${lastName} changed status of claim(id: ${claim._id}) from ${prevStatus} to ${claim.status}`;

    await Log.create({
      userId,
      companyId,
      content: logContent,
    });

    return res.status(HttpStatusCode.OK).json({
      message: 'Claim status updated successfully!',
      claim,
    });
  } catch (err) {
    next(err);
  }
};

// label
export const getLabels: RequestHandler = async (req, res, next) => {
  const { companyId } = req.userData!;

  try {
    const labels = await Label.find({ companyId });

    return res.status(HttpStatusCode.OK).json({
      labels,
    });
  } catch (err) {
    next(err);
  }
};

export const findLabels: RequestHandler = async (req, res, next) => {
  const { companyId } = req.userData!;
  const { keyword } = req.query;
  try {
    const labels = await Label.find({
      companyId,
      name: { $regex: keyword, $options: 'i' },
    });
    return res.status(HttpStatusCode.OK).json({
      labels,
    });
  } catch (err) {
    next(err);
  }
};
export const createLabel: RequestHandler = async (req, res, next) => {
  const { companyId } = req.userData!;
  const { name, color } = req.body;
  try {
    const label = await Label.create({
      name,
      color,
      companyId,
    });

    return res.status(HttpStatusCode.CREATED).json({
      message: 'New Label created successfully!',
      label,
    });
  } catch (err) {
    next(err);
  }
};
export const updateLabel: RequestHandler = async (req, res, next) => {
  const { labelId } = req.params;
  const { name, color } = req.body;
  try {
    const label = await Label.findById(labelId);
    if (!label) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Label with provided id not found.',
      });
    }
    if (name) label.name = name;
    if (color) label.color = color;

    await label.save();

    return res.status(HttpStatusCode.OK).json({
      message: 'Label updated successfully!',
      label,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteLabel: RequestHandler = async (req, res, next) => {
  const { labelId } = req.params;

  try {
    const label = await Label.findById(labelId);
    if (!label) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Label with provided id not found.',
      });
    }

    await label.deleteOne({ _id: labelId });

    return res.status(HttpStatusCode.OK).json({
      message: 'Label deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};

//category
export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await ClaimCategory.find({});
    return res.status(HttpStatusCode.OK).json({
      categories,
    });
  } catch (err) {
    next(err);
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {
  const { name } = req.body;
  try {
    const category = await ClaimCategory.create({
      name,
    });
    res.status(HttpStatusCode.CREATED).json({
      category,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCategory: RequestHandler = async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  try {
    const category = await ClaimCategory.findById(categoryId);
    if (!category) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Claim category with provided id not found.',
      });
    }
    category.name = name;
    await category.save();

    return res.status(HttpStatusCode.OK).json({
      message: 'Claim category updated successfully!',
      category,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const category = await ClaimCategory.findById(categoryId);
    if (!category) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Claim category with provided id not found.',
      });
    }

    await category.deleteOne({ _id: categoryId });

    return res.status(HttpStatusCode.OK).json({
      message: 'Claim category deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};

// msssage
export const getMessages: RequestHandler = async (req, res, next) => {
  const { claimId } = req.params;
  try {
    const messages = await CommentMessage.aggregate([
      { $match: { claimId: new Types.ObjectId(claimId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            {
              $project: {
                profileImg: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      },
      { $project: { userId: 0 } },
    ]);
    return res.status(HttpStatusCode.OK).json({
      messages,
    });
  } catch (err) {
    next(err);
  }
};
export const createMessage: RequestHandler = async (req, res, next) => {
  const { claimId } = req.params;
  const { _id: userId } = req.userData!;
  const { message } = req.body;

  try {
    const msg = await CommentMessage.create({
      claimId,
      userId,
      message,
    });

    return res.status(HttpStatusCode.CREATED).json({
      message: 'Message created successfully!',
      msg,
    });
  } catch (err) {
    next(err);
  }
};

export const changeMessageReadStatus: RequestHandler = async (
  req,
  res,
  next
) => {
  const { claimId } = req.params;
  const { hasNewComment } = req.body;
  try {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Claim with provided ID not found.',
      });
    }

    claim.hasNewComment = hasNewComment;
    await claim.save();

    return res.status(HttpStatusCode.OK).json({
      message: 'Message status for the claim updated successfully!',
    });
  } catch (err) {
    next(err);
  }
};
