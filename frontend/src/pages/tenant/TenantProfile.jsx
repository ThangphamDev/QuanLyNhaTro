import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Alert,
  Paper,
  Divider
} from '@mui/material'
import {
  Person,
  Edit,
  Save,
  Cancel,
  Email,
  Phone,
  Badge,
  LockReset
} from '@mui/icons-material'
  LockReset
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import api from '../../api'

const schema = yup.object({
  full_name: yup.string().required('Họ tên là bắt buộc'),
  phone_number: yup.string().required('Số điện thoại là bắt buộc'),
})

export default function TenantProfile() {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdError, setPwdError] = useState('')
  const [pwdSuccess, setPwdSuccess] = useState('')
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    // Load latest profile from server for accurate status/phone
    api.get('/tenant/profile')
      .then(r => {
        setUser(r.data)
        reset(r.data)
        // sync a subset back to localStorage for header/menu
        const stored = JSON.parse(localStorage.getItem('user') || '{}')
        localStorage.setItem('user', JSON.stringify({ ...stored, full_name: r.data.full_name, phone_number: r.data.phone_number, is_active: r.data.is_active }))
      })
      .catch(() => {
        // fallback to localStorage if API fails
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        setUser(userData)
        reset(userData)
      })
  }, [reset])

  const onSubmit = async (data) => {
    try {
      setError('')
      setSuccess('')
      
  // Update profile via API
  const payload = { full_name: data.full_name, phone_number: data.phone_number }
  const r = await api.put('/tenant/profile', payload)
  localStorage.setItem('user', JSON.stringify({ ...(JSON.parse(localStorage.getItem('user') || '{}')), full_name: r.data.full_name, phone_number: r.data.phone_number, is_active: r.data.is_active }))
  setUser(r.data)
      setEditing(false)
      setSuccess('Thông tin đã được cập nhật thành công!')
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }

  const handleCancel = () => {
    reset(user)
    setEditing(false)
    setError('')
  }

  const changePassword = async (e) => {
      e.preventDefault()
      setPwdError('')
      setPwdSuccess('')
      if (!pwd.next || pwd.next.length < 6) return setPwdError('Mật khẩu mới tối thiểu 6 ký tự')
      if (pwd.next !== pwd.confirm) return setPwdError('Xác nhận mật khẩu không khớp')
      try {
        setPwdLoading(true)
        await api.post('/auth/change-password', { current_password: pwd.current, new_password: pwd.next })
        setPwdSuccess('Đổi mật khẩu thành công')
        try {
          const stored = JSON.parse(localStorage.getItem('user') || '{}')
          localStorage.setItem('user', JSON.stringify({ ...stored, must_change_password: false }))
        } catch {}
        setPwd({ current: '', next: '', confirm: '' })
      } catch (e) {
        setPwdError(e.response?.data?.message || 'Đổi mật khẩu thất bại')
      } finally {
        setPwdLoading(false)
      }
    }

  if (!user) {
    return <Typography>Đang tải...</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <Person sx={{ mr: 1 }} />
        Hồ Sơ Cá Nhân
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2
                }}
              >
                {user.full_name?.charAt(0)?.toUpperCase()}
              </Avatar>
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {user.full_name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ID: {user.id}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Vai trò: Người thuê
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant={editing ? "outlined" : "contained"}
                  startIcon={editing ? <Cancel /> : <Edit />}
                  onClick={editing ? handleCancel : () => setEditing(true)}
                  fullWidth
                >
                  {editing ? 'Hủy' : 'Chỉnh sửa'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Thông tin chi tiết
              </Typography>
              
              <Divider sx={{ mb: 3 }} />

              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      disabled={!editing}
                      {...register('full_name')}
                      error={!!errors.full_name}
                      helperText={errors.full_name?.message}
                      InputProps={{
                        startAdornment: <Badge sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user.email}
                      disabled
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      helperText="Email không thể thay đổi"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      disabled={!editing}
                      {...register('phone_number')}
                      error={!!errors.phone_number}
                      helperText={errors.phone_number?.message}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ngày tham gia"
                      value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      disabled
                      helperText="Ngày tạo tài khoản"
                    />
                  </Grid>
                </Grid>

                {editing && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      startIcon={<Cancel />}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                    >
                      Lưu thay đổi
                    </Button>
                  </Box>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockReset /> Thay đổi mật khẩu
                </Typography>
                {pwdSuccess && <Alert severity="success" sx={{ mb: 2 }}>{pwdSuccess}</Alert>}
                {pwdError && <Alert severity="error" sx={{ mb: 2 }}>{pwdError}</Alert>}
                <form onSubmit={changePassword}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Mật khẩu hiện tại"
                        value={pwd.current}
                        onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Mật khẩu mới"
                        value={pwd.next}
                        onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Xác nhận mật khẩu mới"
                        value={pwd.confirm}
                        onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                        required
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button type="submit" variant="contained" disabled={pwdLoading}>
                      {pwdLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>

          {/* Additional Info Cards */}
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Trạng thái tài khoản
                  </Typography>
                  <Typography variant="body1" sx={{ color: user.is_active ? 'success.main' : 'error.main' }}>
                    {user.is_active ? '✅ Đang hoạt động' : '❌ Tạm khóa'}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Loại tài khoản
                  </Typography>
                  <Typography variant="body1">
                    👤 Người thuê phòng
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
