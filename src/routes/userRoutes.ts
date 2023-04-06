import express from 'express';
import {
  createNewUser,
  getUserInfo,
  updateUserInfo,
  updateUserPasssword,
  updateUserProfileImg,
  deleteUser,
} from '../controllers/userController';
import checkAuth from '../middlewares/checkAuth';
import multer from '../middlewares/multer';

const upload = multer.single('userProfileImg');

const router = express.Router();

router.use(checkAuth);

router.post('/create', checkAuth, createNewUser);
router.get('/:userId/info', getUserInfo);

router.put('/:userId/info/update', updateUserInfo);
router.put('/:userId/password/update', updateUserPasssword);
router.put(
  '/:userId/info/profileImg/update',
  function (req, res, next) {
    upload(req, res, function (err) {
      next(err);
    });
  },
  updateUserProfileImg
);
router.delete('/:userId/delete', deleteUser);

export default router;
