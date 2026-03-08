import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { createPost, getFeed, getUserPosts, deletePost, likePost, addComment, getTrendingPosts } from '../controllers/postController.js'

const postRouter = express.Router()

postRouter.post('/create', protect, createPost)
postRouter.get('/feed', protect, getFeed)
postRouter.get('/trending', protect, getTrendingPosts)
postRouter.get('/user/:id', protect, getUserPosts)
postRouter.delete('/:id', protect, deletePost)
postRouter.post('/like/:id', protect, likePost)
postRouter.post('/comment/:id', protect, addComment)

export default postRouter