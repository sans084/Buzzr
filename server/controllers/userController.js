import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Post from '../models/postModel.js'

// Register
export const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, username, email, password: hashedPassword })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(201).json({ message: 'Account created successfully', token, user: { _id: user._id, name: user.name, username: user.username, email: user.email, avatar: user.avatar } })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.json({ message: 'Login successful', token, user: { _id: user._id, name: user.name, username: user.username, email: user.email, avatar: user.avatar } })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('followers', 'name username avatar').populate('following', 'name username avatar')
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({ user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Follow / Unfollow
export const followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id)
        const currentUser = await User.findById(req.userId)

        if (!userToFollow) return res.status(404).json({ message: 'User not found' })
        if (req.params.id === req.userId) return res.status(400).json({ message: 'You cannot follow yourself' })

        const isFollowing = currentUser.following.includes(req.params.id)

        if (isFollowing) {
            await User.findByIdAndUpdate(req.userId, { $pull: { following: req.params.id } })
            await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.userId } })
            res.json({ message: 'Unfollowed successfully' })
        } else {
            await User.findByIdAndUpdate(req.userId, { $push: { following: req.params.id } })
            await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.userId } })
            res.json({ message: 'Followed successfully' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all users for suggestions
export const getSuggestedUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId)
        const users = await User.find({
            _id: { $nin: [...currentUser.following, req.userId] }
        }).select('-password').limit(5)
        res.json({ users })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get current logged in user
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({ user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Search Users
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query
        if (!query) return res.json({ users: [] })
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.userId }
        }).select('-password').limit(10)
        res.json({ users })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get Admin Stats
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalPosts = await Post.countDocuments()
        const users = await User.find().select('-password').sort({ createdAt: -1 })
        const posts = await Post.find().populate('userId', 'name username').sort({ createdAt: -1 })
        res.json({ totalUsers, totalPosts, users, posts })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete User (Admin)
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        await Post.deleteMany({ userId: req.params.id })
        res.json({ message: 'User deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { name, bio, username } = req.body
        if (username) {
            const existing = await User.findOne({ username, _id: { $ne: req.userId } })
            if (existing) return res.status(400).json({ message: 'Username already taken' })
        }
        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, bio, username },
            { new: true }
        ).select('-password')
        res.json({ message: 'Profile updated!', user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}