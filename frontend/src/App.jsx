import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Rooms from './pages/Rooms.jsx'
import RoomDetail from './pages/RoomDetail.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import TenantDashboard from './pages/tenant/Dashboard.jsx'
import TenantChangePassword from './pages/tenant/TenantChangePassword.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

function getToken() { return localStorage.getItem('token') }
function getRole() {
  try { return JSON.parse(localStorage.getItem('user'))?.role } catch { return null }
}
function getMustChange() {
  try { return !!JSON.parse(localStorage.getItem('user'))?.must_change_password } catch { return false }
}

function PrivateRoute({ children, role }) {
  const token = getToken()
  const userRole = getRole()
  const mustChange = getMustChange()
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace />
  if (role && userRole !== role) return <Navigate to="/" replace />
  if (userRole === 'tenant' && mustChange && location.pathname !== '/tenant/change-password') {
    return <Navigate to="/tenant/change-password" replace />
  }
  return children
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/tenant/change-password" element={<PrivateRoute role="tenant"><TenantChangePassword /></PrivateRoute>} />
          <Route path="/tenant/*" element={<PrivateRoute role="tenant"><TenantDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}


