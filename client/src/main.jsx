import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AdminAuthProvider>
          <App />
        </AdminAuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
