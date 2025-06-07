import { Router } from 'express';
import { searchEmailsController } from '../controllers/searchController';

const router = Router();

router.get('/', searchEmailsController);

export default router;
