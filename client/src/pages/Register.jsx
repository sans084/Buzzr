import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import api from '../configs/api'
import toast from 'react-hot-toast'

const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const { data } = await api.post('/api/users/register', formData)
            dispatch(login(data))
            localStorage.setItem('token', data.token)
            toast.success(data.message)
            navigate('/')
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
        transition: 'border-color 0.2s',
        fontFamily: 'var(--font-body)'
    }

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
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
                    }}>Join Buzzr</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Create your account and start buzzing
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                        { name: 'username', label: 'Username', type: 'text', placeholder: '@yourname' },
                        { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                        { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                    ].map(field => (
                        <div key={field.name}>
                            <label style={labelStyle}>{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                onChange={handleChange}
                                value={formData[field.name]}
                                required
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                    ))}
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
                    >
                        {isLoading ? 'Creating account...' : 'Create Account →'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginTop: '24px' }}>
                    Already have an account?{' '}
                    <Link to='/login' style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register