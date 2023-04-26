import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import { SERVER_TMP_DIRECTORY } from '../config/constants';
import Claim from '../models/claim';
import Label from '../models/label';
import UserRole from '../models/userRole';
import ClaimCategory from '../models/claimCategory';
import CommentMessage from '../models/commentMessage';
import Log from '../models/log';
import AppError from '../error/AppError';
import { HttpStatusCode, UserRoleOption } from '../types/enums';
import { ClaimDetail } from '../types';
import uploadFile from '../utils/uploadFile';

export const getClaimList: RequestHandler = async (req, res, next) => {
  const { status } = req.query;
  const { _id: userId, companyId, roleId } = req.userData!;
  try {
    const role = await UserRole.findById(roleId);
    const matchCondition: {
      companyId: Types.ObjectId;
      status?: string;
      createUserId?: Types.ObjectId;
    } = { companyId: new Types.ObjectId(companyId) };

    if (status) matchCondition.status = status as string;
    if (role!.name === UserRoleOption.GENERAL)
      matchCondition.createUserId = new Types.ObjectId(userId);

    const claims = await Claim.aggregate([
      { $match: matchCondition },
      {
        $project: {
          title: 1,
          createdAt: 1,
          inChargeAdmins: 1,
          body: 1,
          status: 1,
        },
      },
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
    ]).sort({ createdAt: -1 });

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

    if (claim.isAnonymous) claim.createUserId = undefined;

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
    const claim = await Claim.create({
      title,
      body,
      category,
      companyId,
      createUserId,
      isAnonymous: JSON.parse(isAnonymous as string),
    });

    if (req.file) {
      const { url } = await uploadFile(
        `/${SERVER_TMP_DIRECTORY}/${req.file.filename}`,
        claim._id.toHexString(),
        'claim'
      );
      claim.file = url;
      await claim.save();
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

    const logContent = `<b>${firstName} ${lastName}</b> changed status of <b>claim (id: ${claim._id})</b> from <b>${prevStatus}</b> to <b>${claim.status}</b>`;

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

export const changeClaimLabel: RequestHandler = async (req, res, next) => {
  const { claimId } = req.params;
  const { labels } = req.body;

  try {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Claim with provided id not found.',
      });
    }
    claim.labels = labels;
    await claim.save();

    res.status(HttpStatusCode.OK).json({
      message: 'Label for claim updated successfully!',
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
      { $unwind: '$user' },
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
