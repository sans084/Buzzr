# 🐝 Buzzr — Social Media Platform

> A full-stack Twitter-inspired social media application built with the MERN stack, featuring real-time messaging, notifications, and a modern dark UI.

🌐 **Live App:** [buzzr-opal.vercel.app](https://buzzr-opal.vercel.app)  
💻 **GitHub:** [github.com/sans084/Buzzr](https://github.com/sans084/Buzzr)

---

## 🚀 Features

- 🔐 **Authentication** — JWT-based register & login with secure token storage
- 📝 **Post System** — Create, like, comment, and delete posts (280 char limit)
- 👥 **Follow System** — Follow/unfollow users with suggested users sidebar
- 💬 **Real-time Messaging** — Private chat powered by Socket.io
- 🔔 **Notifications** — Live alerts for likes, comments, and follows
- 🔍 **Search** — Find users by name or username
- 📈 **Trending** — Top posts ranked by likes
- ✏️ **Edit Profile** — Update name, username, bio with live avatar preview
- 🛡️ **Admin Dashboard** — View stats, manage users and posts
- 🍞 **Toast Notifications** — Sleek feedback for every user action

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI library |
| Redux Toolkit | State management |
| React Router v6 | Client-side routing |
| Socket.io Client | Real-time communication |
| Tailwind CSS | Styling |
| React Hot Toast | Toast notifications |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database & ODM |
| Socket.io | WebSocket server |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Multer + Cloudinary | File/image uploads |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

```
Buzzr/
├── client/                 # React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Trending.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── redux/          # Redux store & slices
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   └── package.json
│
└── server/                 # Node.js backend
    ├── controllers/
    │   ├── userController.js
    │   └── postController.js
    ├── models/
    │   ├── userModel.js
    │   ├── postModel.js
    │   └── messageModel.js
    ├── routes/
    │   ├── userRoutes.js
    │   └── postRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── server.js
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/sans084/Buzzr.git
cd Buzzr
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

Start the backend:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:
```env
VITE_BASE_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## 🌐 API Routes

### User Routes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/users/register` | Register new user | ❌ |
| POST | `/api/users/login` | Login user | ❌ |
| GET | `/api/users/me` | Get current user | ✅ |
| GET | `/api/users/search?query=` | Search users | ✅ |
| GET | `/api/users/suggestions` | Suggested users | ✅ |
| GET | `/api/users/:id` | Get user profile | ✅ |
| PUT | `/api/users/update` | Update profile | ✅ |
| POST | `/api/users/follow/:id` | Follow/unfollow | ✅ |
| GET | `/api/users/admin/stats` | Admin stats | ✅ |
| DELETE | `/api/users/admin/user/:id` | Delete user | ✅ |

### Post Routes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/posts` | Get all posts | ✅ |
| POST | `/api/posts` | Create post | ✅ |
| DELETE | `/api/posts/:id` | Delete post | ✅ |
| POST | `/api/posts/like/:id` | Like/unlike post | ✅ |
| POST | `/api/posts/comment/:id` | Add comment | ✅ |
| GET | `/api/posts/trending` | Get trending posts | ✅ |

---

## 🎨 Design System

```css
--bg-primary:     #0a0a0f   /* Main background */
--bg-secondary:   #111118   /* Secondary background */
--bg-card:        #16161f   /* Card background */
--accent:         #f5c518   /* Golden yellow accent */
--text-primary:   #f0f0f5   /* Primary text */
--text-secondary: #8888a0   /* Muted text */
```

**Fonts:** Bricolage Grotesque (headings) + Plus Jakarta Sans (body)

---

## 🚀 Deployment Guide

### Frontend — Vercel
1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set Root Directory to `client`
4. Add environment variable: `VITE_BASE_URL=https://your-backend.onrender.com`
5. Click Deploy

### Backend — Render
1. Import repo on [render.com](https://render.com)
2. Set Root Directory to `server`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add environment variables: `MONGODB_URL`, `JWT_SECRET`, `PORT`

> ⚠️ Free tier on Render sleeps after inactivity — first load may take ~50 seconds.

---

## 👩‍💻 Author

**Sanskriti Bharti** — [@sans084](https://github.com/sans084)

---

## 📄 License

This project is built for educational purposes.

---

<p align="center">Built with 🐝 by Sanskriti Bharti</p>

<p align="center">Made with 🐝 and lots of ☕.</p>

