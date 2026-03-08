import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import {
    register, login, getUserProfile, updateProfile,
    followUser, getSuggestedUsers, getMe,
    searchUsers, getAdminStats, deleteUser
} from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/me', protect, getMe)
userRouter.get('/search', protect, searchUsers)
userRouter.get('/suggestions', protect, getSuggestedUsers)
userRouter.get('/admin/stats', protect, getAdminStats)
userRouter.delete('/admin/user/:id', protect, deleteUser)
userRouter.get('/:id', protect, getUserProfile)
userRouter.put('/update', protect, updateProfile)
userRouter.post('/follow/:id', protect, followUser)

export default userRouter