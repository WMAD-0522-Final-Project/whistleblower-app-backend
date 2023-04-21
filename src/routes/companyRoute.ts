import express from 'express';
import {
  createCompany,
  getCompanyInfo,
  updateCompanyInfo,
  updateLogoImg,
  createDepartment,
  deleteDepartment,
} from '../controllers/companyController';
import checkAuth from '../middlewares/checkAuth';
import checkPermission from '../middlewares/checkPermission';
import multer from '../middlewares/multer';
import { UserPermissionOption } from '../types/enums';

const upload = multer.single('companyLogo');

const router = express.Router();

router.use(checkAuth);

router.post('/create', createCompany);
router.get('/info', getCompanyInfo);
router.put(
  '/info/update',
  checkPermission(UserPermissionOption.SYSTEM_MANAGEMENT),
  updateCompanyInfo
);
router.put(
  '/logo/update',
  function (req, res, next) {
    upload(req, res, function (err) {
      next(err);
    });
  },
  checkPermission(UserPermissionOption.SYSTEM_MANAGEMENT),
  updateLogoImg
);

// department
router.post(
  '/department/create',
  checkPermission(UserPermissionOption.SYSTEM_MANAGEMENT),
  createDepartment
);
router.delete(
  '/department/delete',
  checkPermission(UserPermissionOption.SYSTEM_MANAGEMENT),
  deleteDepartment
);

export default router;
