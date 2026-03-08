import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { getNotifications, markAsRead } from '../controllers/notificationController.js'

const notificationRouter = express.Router()

notificationRouter.get('/', protect, getNotifications)
notificationRouter.put('/read', protect, markAsRead)

export default notificationRouter