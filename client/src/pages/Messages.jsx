import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { SendIcon, MessageCircleIcon } from 'lucide-react'
import { io } from 'socket.io-client'

const Avatar = ({ name, size = 40 }) => (
    <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, #f5c518, #e6a800)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#0a0a0f', fontWeight: '700', fontSize: size * 0.38,
        flexShrink: 0, fontFamily: 'var(--font-body)'
    }}>
        {name?.[0]?.toUpperCase()}
    </div>
)

const Messages = () => {
    const { token, user } = useSelector(state => state.auth)
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [socket, setSocket] = useState(null)
    const messagesEndRef = useRef(null)

    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BASE_URL)
        newSocket.emit('join', user?._id)
        newSocket.on('receiveMessage', ({ senderId, message }) => {
            if (senderId === selectedUser?._id) {
                setMessages(prev => [...prev, { senderId, message, createdAt: new Date() }])
            }
        })
        setSocket(newSocket)
        return () => newSocket.disconnect()
    }, [user, selectedUser])

    const loadUsers = async () => {
        try {
            const { data } = await api.get('/api/users/suggestions', { headers })
            setUsers(data.users)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const loadMessages = async (userId) => {
        try {
            const { data } = await api.get(`/api/messages/${userId}`, { headers })
            setMessages(data.messages)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedUser) return
        try {
            await api.post(`/api/messages/send/${selectedUser._id}`, { message: newMessage }, { headers })
            socket?.emit('sendMessage', { senderId: user._id, receiverId: selectedUser._id, message: newMessage })
            setMessages(prev => [...prev, { senderId: user._id, message: newMessage, createdAt: new Date() }])
            setNewMessage('')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => { loadUsers() }, [])
    useEffect(() => { if (selectedUser) loadMessages(selectedUser._id) }, [selectedUser])
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    return (
        <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 64px)' }}>

            {/* Users List */}
            <div style={{
                width: '280px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flexShrink: 0
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        Messages
                    </h2>
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {users.map(u => (
                        <button
                            key={u._id}
                            onClick={() => setSelectedUser(u)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 20px',
                                background: selectedUser?._id === u._id ? 'var(--accent-dim)' : 'transparent',
                                border: 'none',
                                borderLeft: selectedUser?._id === u._id ? '3px solid var(--accent)' : '3px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={e => { if (selectedUser?._id !== u._id) e.currentTarget.style.background = 'var(--bg-hover)' }}
                            onMouseLeave={e => { if (selectedUser?._id !== u._id) e.currentTarget.style.background = 'transparent' }}
                        >
                            <Avatar name={u.name} size={38} />
                            <div>
                                <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px', fontFamily: 'var(--font-body)' }}>{u.name}</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{u.username}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div style={{
                flex: 1,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <Avatar name={selectedUser.name} size={38} />
                            <div>
                                <p style={{ fontFamily: 'var(--font-body)', fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}>
                                    {selectedUser.name}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>@{selectedUser.username}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-secondary)' }}>
                                    <p style={{ fontSize: '32px', marginBottom: '12px' }}>👋</p>
                                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: '600' }}>Start the conversation!</p>
                                </div>
                            )}
                            {messages.map((msg, i) => {
                                const isMine = msg.senderId === user._id
                                return (
                                    <div key={i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                                        {!isMine && <Avatar name={selectedUser.name} size={28} />}
                                        <div>
                                            <div style={{
                                                maxWidth: '320px',
                                                padding: '12px 16px',
                                                borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                                background: isMine ? 'var(--accent)' : 'var(--bg-secondary)',
                                                color: isMine ? '#0a0a0f' : 'var(--text-primary)',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                fontFamily: 'var(--font-body)',
                                                boxShadow: isMine ? '0 0 20px #f5c51820' : 'none'
                                            }}>
                                                {msg.message}
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px', textAlign: isMine ? 'right' : 'left' }}>
                                                {formatTime(msg.createdAt)}
                                            </p>
                                        </div>
                                        {isMine && <Avatar name={user.name} size={28} />}
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} style={{
                            padding: '16px 20px',
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <input
                                type='text'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder='Type a message...'
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '14px',
                                    color: 'var(--text-primary)',
                                    fontSize: '15px',
                                    outline: 'none',
                                    fontFamily: 'var(--font-body)',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                            <button type='submit' style={{
                                width: '44px',
                                height: '44px',
                                background: 'var(--accent)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#0a0a0f',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: '0 0 15px #f5c51825',
                                transition: 'all 0.2s'
                            }}>
                                <SendIcon size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        <MessageCircleIcon size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            Your Messages
                        </p>
                        <p style={{ fontSize: '14px', marginTop: '8px' }}>Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Messages