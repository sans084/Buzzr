import Message from '../models/messageModel.js'

// Get Messages
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.userId, receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.userId }
            ]
        }).sort({ createdAt: 1 })
        res.json({ messages })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Send Message
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body
        if (!message) return res.status(400).json({ message: 'Message is required' })

        const newMessage = await Message.create({
            senderId: req.userId,
            receiverId: req.params.userId,
            message
        })
        res.status(201).json({ message: 'Message sent', data: newMessage })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}