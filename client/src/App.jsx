import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, setLoading } from './app/features/authSlice'
import api from './configs/api'
import { Toaster } from 'react-hot-toast'
import Search from './pages/Search'
import EditProfile from './pages/EditProfile'
import Trending from './pages/Trending'
import AdminDashboard from './pages/AdminDashboard'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Layout from './pages/Layout'

const App = () => {
    const dispatch = useDispatch()
    const { token, loading } = useSelector(state => state.auth)

    const getUserData = async () => {
        const savedToken = localStorage.getItem('token')
        try {
            if (savedToken) {
                const { data } = await api.get('/api/users/me', {
                    headers: { Authorization: `Bearer ${savedToken}` }
                })
                dispatch(login({ token: savedToken, user: data.user }))
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            dispatch(setLoading(false))
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    if (loading) return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500'></div>
        </div>
    )

    return (
        <>
            <Toaster />
            <Routes>
                <Route path='/login' element={!token ? <Login /> : <Navigate to='/' />} />
                <Route path='/register' element={!token ? <Register /> : <Navigate to='/' />} />
                <Route path='/' element={token ? <Layout /> : <Navigate to='/login' />}>
                    <Route index element={<Home />} />
                    <Route path='profile/:id' element={<Profile />} />
                    <Route path='messages' element={<Messages />} />
                    <Route path='notifications' element={<Notifications />} />
                    <Route path='search' element={<Search />} />
                <Route path='edit-profile' element={<EditProfile />} />
                <Route path='trending' element={<Trending />} />
                <Route path='admin' element={<AdminDashboard />} />
                </Route>
            </Routes>
        </>
    )
}

export default App