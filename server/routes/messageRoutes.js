import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { getMessages, sendMessage } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.get('/:userId', protect, getMessages)
messageRouter.post('/send/:userId', protect, sendMessage)

export default messageRouter