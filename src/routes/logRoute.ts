import express from 'express';

import checkAuth from '../middlewares/checkAuth';
import { getLogs } from '../controllers/logController';

const router = express.Router();

router.use(checkAuth);

router.get('/list', getLogs);

export default router;
