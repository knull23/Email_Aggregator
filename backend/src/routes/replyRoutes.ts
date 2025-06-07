import { Router } from 'express';
import { getSuggestedReply } from '../controllers/replyController';

const router = Router();

router.post('/:emailId', getSuggestedReply);

export default router;
