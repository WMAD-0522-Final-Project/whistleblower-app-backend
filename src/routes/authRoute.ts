import express from 'express';
import {
  verifyToken,
  login,
  logout,
  refreshToken,
} from '../controllers/authController';
import checkAuth from '../middlewares/checkAuth';

const router = express.Router();

router.get('/verify-token', checkAuth, verifyToken);
router.post('/login', login);
router.get('/logout', checkAuth, logout);
router.get('/refresh', refreshToken);

export default router;
