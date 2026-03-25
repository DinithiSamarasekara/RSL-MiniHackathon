import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FinanceProvider } from './contexts/FinanceContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FinanceProvider>
      <App />
    </FinanceProvider>
  </React.StrictMode>,
)
