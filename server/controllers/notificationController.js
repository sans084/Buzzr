import Notification from '../models/notificationModel.js'

// Get Notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId })
            .populate('senderId', 'name username avatar')
            .populate('postId', 'content')
            .sort({ createdAt: -1 })
        res.json({ notifications })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Mark as Read
export const markAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.userId }, { read: true })
        res.json({ message: 'Notifications marked as read' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}