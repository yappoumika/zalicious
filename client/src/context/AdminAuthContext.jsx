import { createContext, useContext, useState, useCallback } from 'react'
import api from '../lib/api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ps_admin_token'))

  const login = useCallback(async (password) => {
    const { data } = await api.post('/auth/login', { password })
    localStorage.setItem('ps_admin_token', data.token)
    setToken(data.token)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ps_admin_token')
    setToken(null)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ token, isAuthed: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
