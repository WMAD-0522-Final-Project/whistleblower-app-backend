import express from 'express';
import {
  changeClaimStatus,
  createClaim,
  getClaimDetail,
  getClaimList,
  assignInChargeAdmin,
  //   getMessages,
  //   createMessage,
  //   updateMessage,
  deleteLabel,
  updateLabel,
  createLabel,
} from '../controllers/claimController';
import checkAuth from '../middlewares/checkAuth';

const router = express.Router();

router.use(checkAuth);

router.get('/list', getClaimList);
router.get('/:claimId/detail', getClaimDetail);
router.post('/create', createClaim);
router.put('/:claimId/assign', assignInChargeAdmin);
router.put('/:claimId/changeStatus', changeClaimStatus);
router.get('/label/list', changeClaimStatus);
// label
router.post('/label/create', createLabel);
router.put('/label/update', updateLabel);
router.delete('/label/delete', deleteLabel);
// message
// router.get('/message/list', getMessages);
// router.post('/message/create', createMessage);
// router.put('/message/update', updateMessage);
// router.delete('/message/delete/', changeClaimStatus);

export default router;

// ## for update new comment falg
