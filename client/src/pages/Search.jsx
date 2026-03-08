import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { SearchIcon, UserPlusIcon, UserCheckIcon } from 'lucide-react'

const Avatar = ({ name, size = 40 }) => (
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

const Search = () => {
    const { token, user } = useSelector(state => state.auth)
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [following, setFollowing] = useState({})

    const headers = { Authorization: `Bearer ${token}` }

    const searchUsers = async (e) => {
        const val = e.target.value
        setQuery(val)
        if (!val.trim()) return setUsers([])
        setLoading(true)
        try {
            const { data } = await api.get(`/api/users/search?query=${val}`, { headers })
            setUsers(data.users)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
        setLoading(false)
    }

    const handleFollow = async (userId) => {
        try {
            await api.post(`/api/users/follow/${userId}`, {}, { headers })
            const isNowFollowing = !following[userId]
            setFollowing(prev => ({ ...prev, [userId]: isNowFollowing }))
            toast.success(isNowFollowing ? '🐝 Following!' : 'Unfollowed')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Search
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                    Find people to follow
                </p>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <SearchIcon size={18} style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-secondary)'
                }} />
                <input
                    type='text'
                    placeholder='Search by name or username...'
                    value={query}
                    onChange={searchUsers}
                    style={{
                        width: '100%',
                        padding: '14px 16px 14px 46px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        color: 'var(--text-primary)',
                        fontSize: '15px',
                        outline: 'none',
                        fontFamily: 'var(--font-body)',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Searching...
                </div>
            )}

            {/* No results */}
            {!loading && query && users.length === 0 && (
                <div style={{
                    textAlign: 'center', padding: '60px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    color: 'var(--text-secondary)'
                }}>
                    <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '16px' }}>No users found</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>Try a different search term</p>
                </div>
            )}

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {users.map(u => (
                    <div key={u._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        transition: 'border-color 0.2s'
                    }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                        <Link to={`/profile/${u._id}`} style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
                            <Avatar name={u.name} size={48} />
                            <div>
                                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}>
                                    {u.name}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>@{u.username}</p>
                                {u.bio && <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>{u.bio}</p>}
                            </div>
                        </Link>
                        <button
                            onClick={() => handleFollow(u._id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '8px 16px',
                                background: following[u._id] ? 'transparent' : 'var(--accent)',
                                border: following[u._id] ? '1px solid var(--border)' : 'none',
                                borderRadius: '10px',
                                color: following[u._id] ? 'var(--text-secondary)' : '#0a0a0f',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: '700',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                flexShrink: 0
                            }}
                        >
                            {following[u._id]
                                ? <><UserCheckIcon size={14} /> Following</>
                                : <><UserPlusIcon size={14} /> Follow</>
                            }
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Search