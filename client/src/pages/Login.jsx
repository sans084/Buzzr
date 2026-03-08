import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import api from '../configs/api'
import toast from 'react-hot-toast'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const { data } = await api.post('/api/users/login', formData)
            dispatch(login(data))
            localStorage.setItem('token', data.token)
            toast.success(data.message)
            navigate('/')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
        setIsLoading(false)
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background glow */}
            <div style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #f5c51808 0%, transparent 70%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                padding: '48px',
                position: 'relative',
                boxShadow: '0 0 80px #f5c51808, 0 32px 64px #00000060'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '56px',
                        height: '56px',
                        background: 'var(--accent)',
                        borderRadius: '16px',
                        marginBottom: '16px',
                        fontSize: '28px',
                        boxShadow: '0 0 30px #f5c51840'
                    }}>🐝</div>
                    <h1 style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '28px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        marginBottom: '8px'
                    }}>Welcome back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Sign in to your Buzzr account
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Email
                        </label>
                        <input
                            type='email' name='email'
                            placeholder='you@example.com'
                            onChange={handleChange} value={formData.email}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                fontFamily: 'var(--font-body)'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Password
                        </label>
                        <input
                            type='password' name='password'
                            placeholder='••••••••'
                            onChange={handleChange} value={formData.password}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                fontFamily: 'var(--font-body)'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>
                    <button
                        type='submit' disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: isLoading ? '#f5c51880' : 'var(--accent)',
                            color: '#0a0a0f',
                            fontFamily: 'var(--font-body)',
                            fontWeight: '700',
                            fontSize: '15px',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 0 20px #f5c51830',
                            marginTop: '8px'
                        }}
                        onMouseEnter={e => !isLoading && (e.target.style.background = 'var(--accent-hover)')}
                        onMouseLeave={e => !isLoading && (e.target.style.background = 'var(--accent)')}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In →'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginTop: '24px' }}>
                    Don't have an account?{' '}
                    <Link to='/register' style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login