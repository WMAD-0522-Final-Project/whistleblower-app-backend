import express from 'express';
import {
  changeClaimStatus,
  createClaim,
  getClaimDetail,
  getClaimList,
  assignInChargeAdmin,
  getMessages,
  createMessage,
  changeMessageReadStatus,
  changeClaimLabel,
  getLabels,
  findLabels,
  deleteLabel,
  updateLabel,
  createLabel,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/claimController';
import checkAuth from '../middlewares/checkAuth';
import checkPermission from '../middlewares/checkPermission';
import { UserPermissionOption } from '../types/enums';

const router = express.Router();

router.use(checkAuth);

router.get('/list', getClaimList);
router.get(
  '/:claimId/detail',
  checkPermission(UserPermissionOption.REPORT_VIEWING),
  getClaimDetail
);
router.post('/create', createClaim);
router.put(
  '/:claimId/assign',
  checkPermission(UserPermissionOption.CASE_MANAGEMENT),
  assignInChargeAdmin
);
router.put(
  '/:claimId/changeStatus',
  checkPermission(UserPermissionOption.CASE_MANAGEMENT),
  changeClaimStatus
);

router.put(
  '/:claimId/changeLabel',
  checkPermission(UserPermissionOption.CASE_MANAGEMENT),
  changeClaimLabel
);

// label
router.get('/label/list', getLabels);
router.get('/label/find', findLabels);
router.post(
  '/label/create',
  checkPermission(UserPermissionOption.CASE_MANAGEMENT),
  createLabel
);
router.put(
  '/label/:labelId/update',
  checkPermission(UserPermissionOption.CASE_MANAGEMENT),
  updateLabel
);
router.delete(
  '/label/:labelId/delete',
  checkPermission(UserPermissionOption.CASE_MANAGEMENT),
  deleteLabel
);
// category
router.get('/category/list', getCategories);
router.post(
  '/category/create',
  checkPermission(UserPermissionOption.CASE_MANAGEMENT),
  createCategory
);
router.put(
  '/category/:categoryId/update',
  checkPermission(UserPermissionOption.CASE_MANAGEMENT),
  updateCategory
);
router.delete(
  '/category/:categoryId/delete',
  checkPermission(UserPermissionOption.CASE_MANAGEMENT),
  deleteCategory
);

// message
router.get('/:claimId/message/list', getMessages);
router.post('/:claimId/message/create', createMessage);
router.put('/:claimId/message/changeReadStatus', changeMessageReadStatus);

export default router;
