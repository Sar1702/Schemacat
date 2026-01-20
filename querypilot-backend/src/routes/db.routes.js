import express from 'express';
import { connectDatabase, getSchema } from '../controllers/db.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { connectDbSchema } from '../validations/db.validation.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/connect', protect, validate(connectDbSchema), connectDatabase);
router.get('/schema', protect, getSchema);

export default router;
