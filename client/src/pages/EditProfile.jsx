import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../app/features/authSlice'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { SaveIcon, ArrowLeftIcon } from 'lucide-react'

const EditProfile = () => {
    const { token, user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        bio: user?.bio || ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const headers = { Authorization: `Bearer ${token}` }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim()) return toast.error('Name cannot be empty')
        if (!formData.username.trim()) return toast.error('Username cannot be empty')
        setIsLoading(true)
        try {
            const { data } = await api.put('/api/users/update', formData, { headers })
            dispatch(login({ token, user: data.user }))
            toast.success('Profile updated! 🐝')
            navigate(`/profile/${user._id}`)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
        setIsLoading(false)
    }

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        color: 'var(--text-primary)',
        fontSize: '15px',
        outline: 'none',
        fontFamily: 'var(--font-body)',
        transition: 'border-color 0.2s'
    }

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontFamily: 'var(--font-heading)'
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        width: '40px', height: '40px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                    <ArrowLeftIcon size={18} />
                </button>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Edit Profile
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Update your public profile
                    </p>
                </div>
            </div>

            {/* Live Avatar Preview */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '20px',
                marginBottom: '32px', padding: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px'
            }}>
                <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f5c518, #e6a800)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0a0a0f', fontWeight: '800', fontSize: '28px',
                    fontFamily: 'var(--font-heading)',
                    boxShadow: '0 0 30px #f5c51830',
                    transition: 'all 0.2s'
                }}>
                    {formData.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--text-primary)' }}>
                        {formData.name || 'Your Name'}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        @{formData.username || 'username'}
                    </p>
                    {formData.bio && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', maxWidth: '280px' }}>
                            {formData.bio}
                        </p>
                    )}
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                        type='text' name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Your full name'
                        maxLength={50}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Username</label>
                    <input
                        type='text' name='username'
                        value={formData.username}
                        onChange={handleChange}
                        placeholder='@username'
                        maxLength={30}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>Bio</label>
                        <span style={{
                            fontSize: '12px',
                            color: formData.bio.length > 140 ? '#ef4444' : 'var(--text-secondary)'
                        }}>
                            {formData.bio.length}/160
                        </span>
                    </div>
                    <textarea
                        name='bio'
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder='Tell people about yourself...'
                        rows={4}
                        maxLength={160}
                        style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                </div>

                <button
                    type='submit' disabled={isLoading}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '14px',
                        background: isLoading ? '#f5c51880' : 'var(--accent)',
                        color: '#0a0a0f',
                        border: 'none',
                        borderRadius: '12px',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: '700',
                        fontSize: '15px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 0 20px #f5c51830'
                    }}
                >
                    <SaveIcon size={16} />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    )
}

export default EditProfile