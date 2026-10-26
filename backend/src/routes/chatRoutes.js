import express from 'express';
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.route('/')
  .get(getConversations)
  .post(getOrCreateConversation);

router.route('/:id/messages')
  .get(getMessages)
  .post(sendMessage);

export default router;
