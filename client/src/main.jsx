import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#16161f',
            color: '#f0f0f5',
            border: '1px solid #ffffff10',
            borderRadius: '14px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#f5c518', secondary: '#0a0a0f' },
            style: {
              background: '#16161f',
              border: '1px solid #f5c51830',
              color: '#f0f0f5',
            },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' },
            style: {
              background: '#16161f',
              border: '1px solid #ef444430',
              color: '#f0f0f5',
            },
          },
        }}
      />
      <App />
    </Provider>
  </BrowserRouter>
)