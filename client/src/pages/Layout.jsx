import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../app/features/authSlice'
import { HomeIcon, BellIcon, MessageCircleIcon, UserIcon, LogOutIcon, SearchIcon, TrendingUpIcon, ShieldIcon } from 'lucide-react'

const Layout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const navItems = [
        { to: '/', icon: <HomeIcon size={18} />, label: 'Home', end: true },
        { to: '/search', icon: <SearchIcon size={18} />, label: 'Search' },
        { to: '/trending', icon: <TrendingUpIcon size={18} />, label: 'Trending' },
        { to: '/notifications', icon: <BellIcon size={18} />, label: 'Notifications' },
        { to: '/messages', icon: <MessageCircleIcon size={18} />, label: 'Messages' },
        { to: `/profile/${user?._id}`, icon: <UserIcon size={18} />, label: 'Profile' },
        { to: '/admin', icon: <ShieldIcon size={18} />, label: 'Admin' },
    ]

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
        }}>
            {/* Sidebar */}
            <div style={{
                width: '260px',
                background: 'var(--bg-card)',
                borderRight: '1px solid var(--border)',
                position: 'fixed',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '32px 20px',
                zIndex: 100
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', paddingLeft: '8px' }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        background: 'var(--accent)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 0 20px #f5c51840',
                        flexShrink: 0
                    }}>🐝</div>
                    <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '22px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em'
                    }}>Buzzr</span>
                </div>

                {/* Nav */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                fontFamily: 'var(--font-body)',
                                fontWeight: isActive ? '600' : '400',
                                fontSize: '15px',
                                color: isActive ? '#0a0a0f' : 'var(--text-secondary)',
                                background: isActive ? 'var(--accent)' : 'transparent',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                boxShadow: isActive ? '0 0 20px #f5c51830' : 'none',
                            })}
                            onMouseEnter={e => {
                                if (!e.currentTarget.style.background.includes('f5c518') || e.currentTarget.style.background === 'transparent') {
                                    e.currentTarget.style.background = 'var(--bg-hover)'
                                    e.currentTarget.style.color = 'var(--text-primary)'
                                }
                            }}
                            onMouseLeave={e => {
                                const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent'
                                    e.currentTarget.style.color = 'var(--text-secondary)'
                                }
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User + Logout */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '8px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0a0a0f',
                            fontWeight: '700',
                            fontSize: '14px',
                            flexShrink: 0
                        }}>
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{user?.username}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            color: '#ef4444',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                            fontSize: '15px',
                            fontWeight: '500',
                            width: '100%',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#ef444415'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <LogOutIcon size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div style={{ marginLeft: '260px', flex: 1, maxWidth: 'calc(100% - 260px)' }}>
                <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout