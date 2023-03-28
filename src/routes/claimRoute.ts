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

const router = express.Router();

router.use(checkAuth);

router.get('/list', getClaimList);
router.get('/:claimId/detail', getClaimDetail);
router.post('/create', createClaim);
router.put('/:claimId/assign', assignInChargeAdmin);
router.put('/:claimId/changeStatus', changeClaimStatus);

// label
router.get('/label/list', getLabels);
router.get('/label/find', findLabels);
router.post('/label/create', createLabel);
router.put('/label/:labelId/update', updateLabel);
router.delete('/label/:labelId/delete', deleteLabel);
// category
router.get('/category/list', getCategories);
router.post('/category/create', createCategory);
router.put('/category/:categoryId/update', updateCategory);
router.delete('/category/:categoryId/delete', deleteCategory);

// message
router.get('/:claimId/message/list', getMessages);
router.post('/:claimId/message/create', createMessage);
router.put('/:claimId/message/changeReadStatus', changeMessageReadStatus);

export default router;
