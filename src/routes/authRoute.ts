import express from 'express';
import { verifyToken, login } from '../controllers/authController';
import checkAuth from '../middlewares/checkAuth';

const router = express.Router();

router.get('/verify-token', checkAuth, verifyToken);
router.post('/login', login);

export default router;
