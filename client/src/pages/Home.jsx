import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { HeartIcon, MessageCircleIcon, TrashIcon, SendIcon } from 'lucide-react'

const Avatar = ({ name, size = 40, accent = false }) => (
    <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: accent ? 'var(--accent)' : 'linear-gradient(135deg, #f5c518, #e6a800)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0a0a0f',
        fontWeight: '700',
        fontSize: size * 0.38,
        flexShrink: 0,
        fontFamily: 'var(--font-body)'
    }}>
        {name?.[0]?.toUpperCase()}
    </div>
)

const Home = () => {
    const { token, user } = useSelector(state => state.auth)
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [comment, setComment] = useState({})
    const [showComments, setShowComments] = useState({})

    const headers = { Authorization: `Bearer ${token}` }

    const loadPosts = async () => {
        try {
            const { data } = await api.get('/api/posts/feed', { headers })
            setPosts(data.posts)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const createPost = async (e) => {
        e.preventDefault()
        if (!content.trim()) return
        setIsLoading(true)
        try {
            const { data } = await api.post('/api/posts/create', { content }, { headers })
            setPosts(prev => [data.post, ...prev])
            setContent('')
            toast.success('Buzzed! 🐝')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
        setIsLoading(false)
    }

    const likePost = async (postId) => {
        try {
            await api.post(`/api/posts/like/${postId}`, {}, { headers })
            setPosts(prev => prev.map(post => {
                if (post._id === postId) {
                    const isLiked = post.likes.includes(user._id)
                    if (!isLiked) toast.success('❤️ Liked!')
                    return { ...post, likes: isLiked ? post.likes.filter(id => id !== user._id) : [...post.likes, user._id] }
                }
                return post
            }))
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const deletePost = async (postId) => {
        try {
            await api.delete(`/api/posts/${postId}`, { headers })
            setPosts(prev => prev.filter(post => post._id !== postId))
            toast.success('Post deleted')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const addComment = async (postId) => {
        if (!comment[postId]?.trim()) return
        try {
            const { data } = await api.post(`/api/posts/comment/${postId}`, { text: comment[postId] }, { headers })
            setPosts(prev => prev.map(post => post._id === postId ? data.post : post))
            setComment(prev => ({ ...prev, [postId]: '' }))
            toast.success('💬 Comment added!')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const formatTime = (date) => {
        const d = new Date(date)
        const now = new Date()
        const diff = Math.floor((now - d) / 1000)
        if (diff < 60) return `${diff}s`
        if (diff < 3600) return `${Math.floor(diff / 60)}m`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`
        return `${Math.floor(diff / 86400)}d`
    }

    useEffect(() => { loadPosts() }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Header */}
            <div style={{ marginBottom: '8px' }}>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '26px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em'
                }}>Home</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                    What's buzzing today?
                </p>
            </div>

            {/* Create Post */}
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '20px',
                transition: 'border-color 0.2s'
            }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                    <Avatar name={user?.name} size={42} />
                    <form onSubmit={createPost} style={{ flex: 1 }}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's buzzing? 🐝"
                            maxLength={280}
                            rows={3}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                                resize: 'none',
                                fontFamily: 'var(--font-body)',
                                lineHeight: '1.6',
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '1px solid var(--border)',
                            paddingTop: '14px',
                            marginTop: '8px'
                        }}>
                            <span style={{
                                fontSize: '13px',
                                color: content.length > 250 ? '#ef4444' : 'var(--text-secondary)'
                            }}>{content.length}/280</span>
                            <button
                                type='submit'
                                disabled={isLoading || !content.trim()}
                                style={{
                                    padding: '10px 24px',
                                    background: (!content.trim() || isLoading) ? 'var(--bg-hover)' : 'var(--accent)',
                                    color: (!content.trim() || isLoading) ? 'var(--text-secondary)' : '#0a0a0f',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontFamily: 'var(--font-heading)',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    cursor: (!content.trim() || isLoading) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: content.trim() ? '0 0 15px #f5c51825' : 'none'
                                }}
                            >
                                {isLoading ? 'Posting...' : 'Buzz it!'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />

            {/* Empty State */}
            {posts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐝</div>
                    <p style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', fontWeight: '600' }}>No posts yet</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>Be the first to buzz!</p>
                </div>
            )}

            {/* Posts */}
            {posts.map(post => {
                const isLiked = post.likes.includes(user?._id)
                const isOwner = post.userId._id === user?._id
                const commentsVisible = showComments[post._id]

                return (
                    <div key={post._id} style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '20px',
                        padding: '20px',
                        transition: 'border-color 0.2s'
                    }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                        {/* Post Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <Link to={`/profile/${post.userId._id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                                <Avatar name={post.userId.name} size={40} />
                                <div>
                                    <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px', fontFamily: 'var(--font-heading)' }}>
                                        {post.userId.name}
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                                        @{post.userId.username} · {formatTime(post.createdAt)}
                                    </p>
                                </div>
                            </Link>
                            {isOwner && (
                                <button
                                    onClick={() => deletePost(post._id)}
                                    style={{
                                        padding: '8px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#ef444415' }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
                                >
                                    <TrashIcon size={16} />
                                </button>
                            )}
                        </div>

                        {/* Post Content */}
                        <p style={{
                            color: 'var(--text-primary)',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            marginBottom: '16px',
                            fontFamily: 'var(--font-body)'
                        }}>{post.content}</p>

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                                onClick={() => likePost(post._id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: isLiked ? '#ef444415' : 'transparent',
                                    color: isLiked ? '#ef4444' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#ef444415'; e.currentTarget.style.color = '#ef4444' }}
                                onMouseLeave={e => { if (!isLiked) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
                            >
                                <HeartIcon size={16} fill={isLiked ? 'currentColor' : 'none'} />
                                {post.likes.length > 0 && post.likes.length}
                            </button>

                            <button
                                onClick={() => setShowComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: commentsVisible ? 'var(--accent-dim)' : 'transparent',
                                    color: commentsVisible ? 'var(--accent)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <MessageCircleIcon size={16} />
                                {post.comments.length > 0 && post.comments.length}
                            </button>
                        </div>

                        {/* Comments Section */}
                        {commentsVisible && (
                            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                {post.comments.map((c, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                        <Avatar name={c.userId?.name} size={30} />
                                        <div style={{
                                            background: 'var(--bg-secondary)',
                                            borderRadius: '12px',
                                            padding: '10px 14px',
                                            flex: 1
                                        }}>
                                            <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
                                                {c.userId?.name}
                                            </p>
                                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{c.text}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Comment */}
                                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                    <Avatar name={user?.name} size={30} />
                                    <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                                        <input
                                            type='text'
                                            placeholder='Write a comment...'
                                            value={comment[post._id] || ''}
                                            onChange={(e) => setComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                                            onKeyDown={(e) => e.key === 'Enter' && addComment(post._id)}
                                            style={{
                                                flex: 1,
                                                padding: '10px 14px',
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '12px',
                                                color: 'var(--text-primary)',
                                                fontSize: '14px',
                                                outline: 'none',
                                                fontFamily: 'var(--font-body)'
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                        />
                                        <button
                                            onClick={() => addComment(post._id)}
                                            style={{
                                                padding: '10px 14px',
                                                background: 'var(--accent)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#0a0a0f',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <SendIcon size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default Home