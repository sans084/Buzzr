import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import postRouter from './routes/postRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: { origin: '*' }
})

const PORT = process.env.PORT || 3000

await connectDB()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('Buzzr Server Running 🐝'))
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/messages', messageRouter)
app.use('/api/notifications', notificationRouter)

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (userId) => {
        socket.join(userId)
    })

    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
        io.to(receiverId).emit('receiveMessage', { senderId, message })
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
    })
})

export { io }

httpServer.listen(PORT, () => console.log(`Buzzr server running on port ${PORT} 🐝`))