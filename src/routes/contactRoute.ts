import express from 'express';
import { contactAdmin } from '../controllers/contactController';

const router = express.Router();

router.post('/', contactAdmin);

export default router;
