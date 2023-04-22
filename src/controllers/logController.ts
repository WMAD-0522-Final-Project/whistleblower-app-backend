import { RequestHandler } from 'express';
import Log from '../models/log';
import { HttpStatusCode } from '../types/enums';

export const getLogs: RequestHandler = async (req, res, next) => {
  const { page = 0 } = req.query;
  const { companyId } = req.userData!;
  const LOGS_PER_PAGE = 25;
  try {
    const logs = await Log.find({ companyId })
      .select({ content: 1, createdAt: 1 })
      .skip(+page * LOGS_PER_PAGE)
      .limit(LOGS_PER_PAGE);

    res.status(HttpStatusCode.OK).json({
      logs,
    });
  } catch (err) {
    next(err);
  }
};
