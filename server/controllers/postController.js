import Post from '../models/postModel.js'
import Notification from '../models/notificationModel.js'
import { io } from '../server.js'

// Create Post
export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body
        if (!content) return res.status(400).json({ message: 'Content is required' })

        const post = await Post.create({ userId: req.userId, content, image })
        const populatedPost = await post.populate('userId', 'name username avatar')
        res.status(201).json({ message: 'Post created', post: populatedPost })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get Feed
export const getFeed = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'name username avatar')
            .sort({ createdAt: -1 })
        res.json({ posts })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get User Posts
export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.id })
            .populate('userId', 'name username avatar')
            .sort({ createdAt: -1 })
        res.json({ posts })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete Post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })
        if (post.userId.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' })

        await Post.findByIdAndDelete(req.params.id)
        res.json({ message: 'Post deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Like / Unlike Post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })

        const isLiked = post.likes.includes(req.userId)
        if (isLiked) {
            await Post.findByIdAndUpdate(req.params.id, { $pull: { likes: req.userId } })
            res.json({ message: 'Post unliked' })
        } else {
            await Post.findByIdAndUpdate(req.params.id, { $push: { likes: req.userId } })

            if (post.userId.toString() !== req.userId) {
                await Notification.create({ userId: post.userId, senderId: req.userId, type: 'like', postId: post._id })
                io.to(post.userId.toString()).emit('notification', { type: 'like' })
            }
            res.json({ message: 'Post liked' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Add Comment
export const addComment = async (req, res) => {
    try {
        const { text } = req.body
        if (!text) return res.status(400).json({ message: 'Comment text is required' })

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { userId: req.userId, text } } },
            { new: true }
        ).populate('userId', 'name username avatar')
          .populate('comments.userId', 'name username avatar')

        if (post.userId._id.toString() !== req.userId) {
            await Notification.create({ userId: post.userId._id, senderId: req.userId, type: 'comment', postId: post._id })
            io.to(post.userId._id.toString()).emit('notification', { type: 'comment' })
        }
        res.json({ message: 'Comment added', post })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// Get Trending Posts
export const getTrendingPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'name username avatar')
            .sort({ likes: -1, createdAt: -1 })
            .limit(10)
        res.json({ posts })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}