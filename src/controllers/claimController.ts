import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import Claim from '../models/claim';
import AppError from '../error/AppError';
import { ClaimStatus, HttpStatusCode } from '../types/enums';
import Label from '../models/label';

export const getClaimList: RequestHandler = async (req, res, next) => {
  const { status = ClaimStatus.Unhandled } = req.query;
  try {
    const claims = await Claim.aggregate([
      { $match: { status } },
      { $project: { title: 1, createdAt: 1, inChargeAdmins: 1 } }, //could change depends on needs
      {
        $lookup: {
          from: 'users',
          localField: 'inChargeAdmins',
          foreignField: '_id',
          as: 'inChargeAdmins',
          pipeline: [
            { $project: { profileImg: 1, firstName: 1, lastName: 1 } }, //could change depends on needs
          ],
        },
      },
    ]);
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

    const claim = await Claim.aggregate([
      { $match: { _id: new Types.ObjectId(claimId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'inChargeAdmins',
          foreignField: '_id',
          as: 'inChargeAdmins',
          pipeline: [
            { $project: { profileImg: 1, firstName: 1, lastName: 1 } }, //could change depends on needs
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
      //TODO: join category
    ]);

    return res.status(HttpStatusCode.OK).json({
      claim,
    });
  } catch (err) {
    next(err);
  }
};

export const createClaim: RequestHandler = async (req, res, next) => {
  const { title, body, categories, labels } = req.body;
  try {
    const claim = await Claim.create({
      title,
      body,
      categories,
      labels,
    });
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

  try {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Claim with provided id not found.',
      });
    }
    claim.status = status;
    await claim.save();

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

// msssage
// export const getMessages: RequestHandler = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(err);
//   }
// };
// export const createMessage: RequestHandler = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(err);
//   }
// };

// export const updateMessage: RequestHandler = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(err);
//   }
// };
// export const deleteMessage: RequestHandler = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(err);
//   }
// };
