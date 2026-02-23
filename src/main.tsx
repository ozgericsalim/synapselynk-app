import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <App />
      <Toaster position="top-right" toastOptions={{ style: { background: '#1f2937', color: '#f3f4f6', border: '1px solid rgba(255,255,255,0.1)' } }} />
    </QueryClientProvider>
  </React.StrictMode>
)
