import { Router } from 'express';
import { fetchEmails, fetchEmailDetail } from '../controllers/emailController';

const router = Router();

router.get('/', fetchEmails);
router.get('/:id', fetchEmailDetail);

export default router;
