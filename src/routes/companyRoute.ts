import express from 'express';
import {
  createCompany,
  getCompanyInfo,
  updateCompanyInfo,
  updateLogoImg,
} from '../controllers/companyController';
import checkAuth from '../middlewares/checkAuth';
import multer from '../middlewares/multer';

const upload = multer.single('companyLogo');

const router = express.Router();

router.use(checkAuth);

router.post('/create', createCompany);
router.get('/info', getCompanyInfo);
router.put('/info/update', updateCompanyInfo);
router.put(
  '/logo/update',
  function (req, res, next) {
    upload(req, res, function (err) {
      next(err);
    });
  },
  updateLogoImg
);

export default router;
