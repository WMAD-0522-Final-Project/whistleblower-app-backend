import express from 'express';
import {
  createNewUser,
  getUserInfo,
  getUserList,
  updateUserInfo,
  updateUserPasssword,
  updateUserProfileImg,
  deleteUser,
  getContactedUser,
} from '../controllers/userController';
import checkAuth from '../middlewares/checkAuth';
import checkPermission from '../middlewares/checkPermission';
import multer from '../middlewares/multer';
import { UserPermissionOption } from '../types/enums';

const upload = multer.single('userProfileImg');

const router = express.Router();

router.use(checkAuth);

router.post(
  '/create',
  checkPermission(UserPermissionOption.USER_MANAGEMENT),
  createNewUser
);
router.get('/list', getUserList);
router.get('/:userId/info', getUserInfo);
router.get('/contacted/list', getContactedUser);

router.put(
  '/:userId/info/update',
  checkPermission(UserPermissionOption.USER_MANAGEMENT),
  updateUserInfo
);
router.put(
  '/:userId/password/update',
  checkPermission(UserPermissionOption.USER_MANAGEMENT),
  updateUserPasssword
);
router.put(
  '/:userId/info/profileImg/update',
  function (req, res, next) {
    upload(req, res, function (err) {
      next(err);
    });
  },
  updateUserProfileImg
);
router.delete(
  '/:userId/delete',
  checkPermission(UserPermissionOption.USER_MANAGEMENT),
  deleteUser
);

export default router;
