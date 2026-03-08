import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { HeartIcon, MessageCircleIcon, TrendingUpIcon, FlameIcon } from 'lucide-react'

const Avatar = ({ name, size = 36 }) => (
    <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, #f5c518, #e6a800)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#0a0a0f', fontWeight: '700', fontSize: size * 0.38,
        flexShrink: 0, fontFamily: 'var(--font-heading)'
    }}>
        {name?.[0]?.toUpperCase()}
    </div>
)

const Trending = () => {
    const { token, user } = useSelector(state => state.auth)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const headers = { Authorization: `Bearer ${token}` }

    const loadTrending = async () => {
        try {
            const { data } = await api.get('/api/posts/trending', { headers })
            setPosts(data.posts)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
        setLoading(false)
    }

    const likePost = async (postId) => {
        try {
            await api.post(`/api/posts/like/${postId}`, {}, { headers })
            setPosts(prev => prev.map(post => {
                if (post._id === postId) {
                    const isLiked = post.likes.includes(user._id)
                    return { ...post, likes: isLiked ? post.likes.filter(id => id !== user._id) : [...post.likes, user._id] }
                }
                return post
            }))
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => { loadTrending() }, [])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    )

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--accent-dim)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FlameIcon size={18} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Trending
                    </h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Most liked posts right now
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {posts.map((post, index) => {
                    const isLiked = post.likes.includes(user?._id)
                    return (
                        <div key={post._id} style={{
                            background: 'var(--bg-card)',
                            border: `1px solid ${index === 0 ? 'var(--border-accent)' : 'var(--border)'}`,
                            borderRadius: '20px',
                            padding: '20px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'border-color 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = index === 0 ? 'var(--border-accent)' : 'var(--border)'}
                        >
                            {/* Rank badge */}
                            <div style={{
                                position: 'absolute', top: '16px', right: '16px',
                                width: '32px', height: '32px',
                                background: index === 0 ? 'var(--accent)' : index === 1 ? '#ffffff15' : index === 2 ? '#cd7f3220' : 'var(--bg-secondary)',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: '800',
                                fontSize: '13px',
                                color: index === 0 ? '#0a0a0f' : 'var(--text-secondary)'
                            }}>
                                #{index + 1}
                            </div>

                            <Link to={`/profile/${post.userId._id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '12px' }}>
                                <Avatar name={post.userId.name} size={36} />
                                <div>
                                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>
                                        {post.userId.name}
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{post.userId.username}</p>
                                </div>
                            </Link>

                            <p style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.6', marginBottom: '14px', fontFamily: 'var(--font-body)', paddingRight: '40px' }}>
                                {post.content}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button
                                    onClick={() => likePost(post._id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 14px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: isLiked ? '#ef444415' : 'var(--bg-secondary)',
                                        color: isLiked ? '#ef4444' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: '600',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <HeartIcon size={15} fill={isLiked ? 'currentColor' : 'none'} />
                                    {post.likes.length}
                                </button>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                    <MessageCircleIcon size={15} />
                                    {post.comments.length}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Trending