import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { HeartIcon, MessageCircleIcon, CalendarIcon, PencilIcon, UserPlusIcon, UserCheckIcon } from 'lucide-react'

const Avatar = ({ name, size = 40 }) => (
    <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f5c518, #e6a800)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0a0a0f',
        fontWeight: '700',
        fontSize: size * 0.38,
        flexShrink: 0,
        fontFamily: 'var(--font-heading)',
        boxShadow: '0 0 30px #f5c51830'
    }}>
        {name?.[0]?.toUpperCase()}
    </div>
)

const Profile = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token, user } = useSelector(state => state.auth)
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [isFollowing, setIsFollowing] = useState(false)

    const headers = { Authorization: `Bearer ${token}` }
    const isOwnProfile = user?._id === id

    const loadProfile = async () => {
        try {
            const { data } = await api.get(`/api/users/${id}`, { headers })
            setProfile(data.user)
            setIsFollowing(data.user.followers.some(f => f._id === user?._id))
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const loadUserPosts = async () => {
        try {
            const { data } = await api.get(`/api/posts/user/${id}`, { headers })
            setPosts(data.posts)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const handleFollow = async () => {
        try {
            await api.post(`/api/users/follow/${id}`, {}, { headers })
            setIsFollowing(prev => !prev)
            setProfile(prev => ({
                ...prev,
                followers: isFollowing
                    ? prev.followers.filter(f => f._id !== user._id)
                    : [...prev.followers, { _id: user._id }]
            }))
            toast.success(isFollowing ? 'Unfollowed' : '🐝 Following!')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => { loadProfile(); loadUserPosts() }, [id])

    if (!profile) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '3px solid var(--border)',
                borderTopColor: 'var(--accent)',
                animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    )

    return (
        <div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

            {/* Cover / Header */}
            <div style={{
                background: 'linear-gradient(135deg, var(--bg-card), #1a1a25)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute',
                    top: '-60px', right: '-60px',
                    width: '200px', height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #f5c51815 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Avatar name={profile.name} size={72} />
                        <div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '22px',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                marginBottom: '4px',
                                letterSpacing: '-0.02em'
                            }}>{profile.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>@{profile.username}</p>
                            {profile.bio && (
                                <p style={{ color: 'var(--text-primary)', fontSize: '15px', lineHeight: '1.5', maxWidth: '340px' }}>
                                    {profile.bio}
                                </p>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                                <CalendarIcon size={14} style={{ color: 'var(--text-secondary)' }} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                                    Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit or Follow button */}
                    {isOwnProfile ? (
                        <button
                            onClick={() => navigate('/edit-profile')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px',
                                borderRadius: '12px',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: '700',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '1px solid var(--border)',
                                background: 'transparent',
                                color: 'var(--text-primary)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                        >
                            <PencilIcon size={14} />
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 24px',
                                borderRadius: '12px',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: '700',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: isFollowing ? '1px solid var(--border)' : 'none',
                                background: isFollowing ? 'transparent' : 'var(--accent)',
                                color: isFollowing ? 'var(--text-secondary)' : '#0a0a0f',
                                boxShadow: isFollowing ? 'none' : '0 0 20px #f5c51830'
                            }}
                        >
                            {isFollowing
                                ? <><UserCheckIcon size={14} /> Following</>
                                : <><UserPlusIcon size={14} /> Follow</>
                            }
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '32px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    {[
                        { label: 'Posts', value: posts.length },
                        { label: 'Followers', value: profile.followers.length },
                        { label: 'Following', value: profile.following.length },
                    ].map(stat => (
                        <div key={stat.label}>
                            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                {stat.value}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Posts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '4px'
                }}>
                    Posts
                </h3>

                {posts.length === 0 && (
                    <div style={{
                        textAlign: 'center', padding: '48px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '20px',
                        color: 'var(--text-secondary)'
                    }}>
                        <p style={{ fontSize: '32px', marginBottom: '12px' }}>🐝</p>
                        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '16px' }}>No posts yet</p>
                        {isOwnProfile && (
                            <p style={{ fontSize: '14px', marginTop: '8px' }}>Share your first buzz!</p>
                        )}
                    </div>
                )}

                {posts.map(post => (
                    <div key={post._id} style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        padding: '18px 20px',
                        transition: 'border-color 0.2s'
                    }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                        <p style={{ color: 'var(--text-primary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
                            {post.content}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <HeartIcon size={14} /> {post.likes.length}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MessageCircleIcon size={14} /> {post.comments.length}
                            </span>
                            <span style={{ marginLeft: 'auto' }}>
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Profile