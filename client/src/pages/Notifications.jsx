import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { HeartIcon, MessageCircleIcon, UserPlusIcon, BellIcon } from 'lucide-react'

const Notifications = () => {
    const { token } = useSelector(state => state.auth)
    const [notifications, setNotifications] = useState([])

    const headers = { Authorization: `Bearer ${token}` }

    const loadNotifications = async () => {
        try {
            const { data } = await api.get('/api/notifications', { headers })
            setNotifications(data.notifications)
            await api.put('/api/notifications/read', {}, { headers })
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getIcon = (type) => {
        if (type === 'like') return <HeartIcon size={14} />
        if (type === 'comment') return <MessageCircleIcon size={14} />
        if (type === 'follow') return <UserPlusIcon size={14} />
    }

    const getIconStyle = (type) => {
        if (type === 'like') return { background: '#ef444420', color: '#ef4444' }
        if (type === 'comment') return { background: '#3b82f620', color: '#3b82f6' }
        if (type === 'follow') return { background: 'var(--accent-dim)', color: 'var(--accent)' }
    }

    const getMessage = (type) => {
        if (type === 'like') return 'liked your post'
        if (type === 'comment') return 'commented on your post'
        if (type === 'follow') return 'started following you'
    }

    useEffect(() => { loadNotifications() }, [])

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Notifications
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                    {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                </p>
            </div>

            {notifications.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px'
                }}>
                    <BellIcon size={40} style={{ color: 'var(--text-secondary)', margin: '0 auto 16px' }} />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>All caught up!</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>No new notifications</p>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map(notif => (
                    <div key={notif._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '16px 20px',
                        background: notif.read ? 'var(--bg-card)' : 'var(--bg-hover)',
                        border: `1px solid ${notif.read ? 'var(--border)' : 'var(--border-accent)'}`,
                        borderRadius: '16px',
                        transition: 'all 0.2s'
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f5c518, #e6a800)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0a0a0f',
                            fontWeight: '700',
                            fontSize: '16px',
                            flexShrink: 0,
                            fontFamily: 'var(--font-body)'
                        }}>
                            {notif.senderId?.name?.[0]?.toUpperCase()}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'var(--text-primary)', fontSize: '15px', lineHeight: '1.4' }}>
                                <Link to={`/profile/${notif.senderId?._id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600', fontFamily: 'var(--font-body)' }}>
                                    {notif.senderId?.name}
                                </Link>
                                {' '}<span style={{ color: 'var(--text-secondary)' }}>{getMessage(notif.type)}</span>
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>
                                {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>

                        {/* Icon badge */}
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            ...getIconStyle(notif.type)
                        }}>
                            {getIcon(notif.type)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Notifications