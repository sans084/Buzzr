import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { UsersIcon, FileTextIcon, TrashIcon, ShieldIcon } from 'lucide-react'

const AdminDashboard = () => {
    const { token } = useSelector(state => state.auth)
    const [stats, setStats] = useState(null)
    const [activeTab, setActiveTab] = useState('users')
    const [loading, setLoading] = useState(true)

    const headers = { Authorization: `Bearer ${token}` }

    const loadStats = async () => {
        try {
            const { data } = await api.get('/api/users/admin/stats', { headers })
            setStats(data)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
        setLoading(false)
    }

    const deleteUser = async (userId) => {
        if (!window.confirm('Delete this user and all their posts?')) return
        try {
            await api.delete(`/api/users/admin/user/${userId}`, { headers })
            setStats(prev => ({
                ...prev,
                users: prev.users.filter(u => u._id !== userId),
                totalUsers: prev.totalUsers - 1
            }))
            toast.success('User deleted')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const deletePost = async (postId) => {
        if (!window.confirm('Delete this post?')) return
        try {
            await api.delete(`/api/posts/${postId}`, { headers })
            setStats(prev => ({
                ...prev,
                posts: prev.posts.filter(p => p._id !== postId),
                totalPosts: prev.totalPosts - 1
            }))
            toast.success('Post deleted')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => { loadStats() }, [])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    )

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--accent-dim)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldIcon size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Admin Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>Manage users and content</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                {[
                    { label: 'Total Users', value: stats?.totalUsers, icon: <UsersIcon size={20} />, color: '#3b82f6' },
                    { label: 'Total Posts', value: stats?.totalPosts, icon: <FileTextIcon size={20} />, color: 'var(--accent)' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '20px',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '48px', height: '48px',
                            background: `${stat.color}15`,
                            borderRadius: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: stat.color
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                {stat.value}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['users', 'posts'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === tab ? 'var(--accent)' : 'var(--bg-card)',
                            color: activeTab === tab ? '#0a0a0f' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textTransform: 'capitalize',
                            border: activeTab !== tab ? '1px solid var(--border)' : 'none'
                        }}
                    >
                        {tab === 'users' ? `👥 Users (${stats?.totalUsers})` : `📝 Posts (${stats?.totalPosts})`}
                    </button>
                ))}
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {stats?.users.map(u => (
                        <div key={u._id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 20px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '14px',
                            transition: 'border-color 0.2s'
                        }}>
                            <Link to={`/profile/${u._id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #f5c518, #e6a800)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#0a0a0f', fontWeight: '700', fontSize: '16px',
                                    fontFamily: 'var(--font-heading)'
                                }}>
                                    {u.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>{u.name}</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{u.username} · {u.email}</p>
                                </div>
                            </Link>
                            <button
                                onClick={() => deleteUser(u._id)}
                                style={{
                                    padding: '8px 14px',
                                    background: '#ef444415',
                                    border: '1px solid #ef444430',
                                    borderRadius: '10px',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#ef444425'}
                                onMouseLeave={e => e.currentTarget.style.background = '#ef444415'}
                            >
                                <TrashIcon size={14} /> Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {stats?.posts.map(post => (
                        <div key={post._id} style={{
                            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px',
                            padding: '16px 20px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '14px'
                        }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px', fontFamily: 'var(--font-heading)', fontWeight: '600' }}>
                                    {post.userId?.name} · @{post.userId?.username}
                                </p>
                                <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.5' }}>
                                    {post.content}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px' }}>
                                    ❤️ {post.likes.length} · 💬 {post.comments.length} · {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => deletePost(post._id)}
                                style={{
                                    padding: '8px 14px',
                                    background: '#ef444415',
                                    border: '1px solid #ef444430',
                                    borderRadius: '10px',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    flexShrink: 0,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#ef444425'}
                                onMouseLeave={e => e.currentTarget.style.background = '#ef444415'}
                            >
                                <TrashIcon size={14} /> Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminDashboard