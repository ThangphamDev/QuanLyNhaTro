import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material'
import { LockReset } from '@mui/icons-material'
import api from '../../api'
import { useNavigate } from 'react-router-dom'

export default function TenantChangePassword() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!next || next.length < 6) return setError('Mật khẩu mới tối thiểu 6 ký tự')
    if (next !== confirm) return setError('Xác nhận mật khẩu không khớp')
    try {
      setLoading(true)
      await api.post('/auth/change-password', { current_password: current, new_password: next })
      // update localStorage flag
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem('user', JSON.stringify({ ...user, must_change_password: false }))
      setSuccess('Đổi mật khẩu thành công')
      setTimeout(() => navigate('/tenant'), 1000)
    } catch (e) {
      setError(e.response?.data?.message || 'Đổi mật khẩu thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <LockReset sx={{ mr: 1 }} />
        Đổi mật khẩu bắt buộc
      </Typography>
      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={submit}>
            <TextField
              fullWidth
              type="password"
              label="Mật khẩu hiện tại"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Mật khẩu mới"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Xác nhận mật khẩu mới"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
