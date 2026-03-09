import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../app/features/authSlice'
import {
    HomeIcon, BellIcon, MessageCircleIcon, UserIcon,
    LogOutIcon, SearchIcon, TrendingUpIcon, ShieldIcon, MenuIcon, XIcon
} from 'lucide-react'

const Layout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const bottomNavItems = [
        { to: '/', icon: <HomeIcon size={22} />, label: 'Home', end: true },
        { to: '/search', icon: <SearchIcon size={22} />, label: 'Search' },
        { to: '/notifications', icon: <BellIcon size={22} />, label: 'Alerts' },
        { to: '/messages', icon: <MessageCircleIcon size={22} />, label: 'Messages' },
        { to: `/profile/${user?._id}`, icon: <UserIcon size={22} />, label: 'Profile' },
    ]

    const sidebarNavItems = [
        { to: '/', icon: <HomeIcon size={18} />, label: 'Home', end: true },
        { to: '/search', icon: <SearchIcon size={18} />, label: 'Search' },
        { to: '/trending', icon: <TrendingUpIcon size={18} />, label: 'Trending' },
        { to: '/notifications', icon: <BellIcon size={18} />, label: 'Notifications' },
        { to: '/messages', icon: <MessageCircleIcon size={18} />, label: 'Messages' },
        { to: `/profile/${user?._id}`, icon: <UserIcon size={18} />, label: 'Profile' },
        { to: '/admin', icon: <ShieldIcon size={18} />, label: 'Admin' },
    ]

    const navLinkStyle = ({ isActive }) => ({
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
    })

    // ─── MOBILE ───────────────────────────────────────────────────
    if (isMobile) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

                {/* Top Bar */}
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0,
                    height: '56px',
                    background: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px', zIndex: 200,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '32px', height: '32px',
                            background: 'var(--accent)', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', boxShadow: '0 0 15px #f5c51840'
                        }}>🐝</div>
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '20px', fontWeight: '800',
                            color: 'var(--text-primary)',
                        }}>Buzzr</span>
                    </div>
                    <button onClick={() => setMenuOpen(true)} style={{
                        background: 'transparent', border: 'none',
                        color: 'var(--text-secondary)', cursor: 'pointer',
                        padding: '8px', borderRadius: '10px',
                        display: 'flex', alignItems: 'center'
                    }}>
                        <MenuIcon size={22} />
                    </button>
                </div>

                {/* Slide-out Drawer */}
                {menuOpen && (
                    <>
                        <div onClick={() => setMenuOpen(false)} style={{
                            position: 'fixed', inset: 0,
                            background: '#00000080', zIndex: 300,
                        }} />
                        <div style={{
                            position: 'fixed', top: 0, right: 0,
                            width: '260px', height: '100vh',
                            background: 'var(--bg-card)',
                            borderLeft: '1px solid var(--border)',
                            zIndex: 400,
                            display: 'flex', flexDirection: 'column',
                            padding: '24px 16px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                                <button onClick={() => setMenuOpen(false)} style={{
                                    background: 'var(--bg-hover)', border: 'none',
                                    color: 'var(--text-secondary)', cursor: 'pointer',
                                    padding: '8px', borderRadius: '10px',
                                    display: 'flex', alignItems: 'center'
                                }}>
                                    <XIcon size={20} />
                                </button>
                            </div>

                            {/* User info */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '8px', marginBottom: '16px',
                                borderBottom: '1px solid var(--border)', paddingBottom: '16px'
                            }}>
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '50%',
                                    background: 'var(--accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#0a0a0f', fontWeight: '700', fontSize: '16px',
                                }}>
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px' }}>{user?.name}</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{user?.username}</p>
                                </div>
                            </div>

                            {/* Extra items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                {[
                                    { to: '/trending', icon: <TrendingUpIcon size={18} />, label: 'Trending' },
                                    { to: '/edit-profile', icon: <UserIcon size={18} />, label: 'Edit Profile' },
                                    { to: '/admin', icon: <ShieldIcon size={18} />, label: 'Admin' },
                                ].map(item => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMenuOpen(false)}
                                        style={navLinkStyle}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>

                            <button onClick={handleLogout} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px 16px', borderRadius: '12px',
                                color: '#ef4444', background: 'transparent',
                                border: 'none', cursor: 'pointer',
                                fontFamily: 'var(--font-body)',
                                fontSize: '15px', fontWeight: '500', width: '100%',
                            }}>
                                <LogOutIcon size={18} />
                                Logout
                            </button>
                        </div>
                    </>
                )}

                {/* Page Content */}
                <div style={{ paddingTop: '68px', paddingBottom: '80px', padding: '68px 12px 80px 12px' }}>
                    <Outlet />
                </div>

                {/* Bottom Nav */}
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    height: '64px',
                    background: 'var(--bg-card)',
                    borderTop: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-around',
                    zIndex: 200,
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}>
                    {bottomNavItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            style={({ isActive }) => ({
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                gap: '2px', padding: '6px 12px',
                                borderRadius: '12px', textDecoration: 'none',
                                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                transition: 'all 0.2s', minWidth: '52px',
                            })}
                        >
                            {({ isActive }) => (
                                <>
                                    <div style={{
                                        padding: '5px', borderRadius: '10px',
                                        background: isActive ? 'var(--accent-dim)' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <span style={{
                                        fontSize: '10px',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: isActive ? '600' : '400',
                                    }}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        )
    }

    // ─── DESKTOP ──────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex' }}>
            {/* Sidebar */}
            <div style={{
                width: '260px', background: 'var(--bg-card)',
                borderRight: '1px solid var(--border)',
                position: 'fixed', height: '100vh',
                display: 'flex', flexDirection: 'column',
                padding: '32px 20px', zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', paddingLeft: '8px' }}>
                    <div style={{
                        width: '38px', height: '38px', background: 'var(--accent)',
                        borderRadius: '10px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '20px',
                        boxShadow: '0 0 20px #f5c51840', flexShrink: 0
                    }}>🐝</div>
                    <span style={{
                        fontFamily: 'var(--font-heading)', fontSize: '22px',
                        fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em'
                    }}>Buzzr</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    {sidebarNavItems.map(item => (
                        <NavLink
                            key={item.to} to={item.to} end={item.end}
                            style={navLinkStyle}
                            onMouseEnter={e => {
                                if (!e.currentTarget.style.background?.includes('f5c518')) {
                                    e.currentTarget.style.background = 'var(--bg-hover)'
                                    e.currentTarget.style.color = 'var(--text-primary)'
                                }
                            }}
                            onMouseLeave={e => {
                                const active = e.currentTarget.getAttribute('aria-current') === 'page'
                                if (!active) {
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

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '8px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'var(--accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#0a0a0f', fontWeight: '700', fontSize: '14px', flexShrink: 0
                        }}>
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{user?.username}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 16px', borderRadius: '12px',
                        color: '#ef4444', background: 'transparent',
                        border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: '15px',
                        fontWeight: '500', width: '100%', transition: 'all 0.2s'
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