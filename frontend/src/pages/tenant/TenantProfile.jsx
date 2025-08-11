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
  Badge
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object({
  full_name: yup.string().required('Họ tên là bắt buộc'),
  phone_number: yup.string().required('Số điện thoại là bắt buộc'),
})

export default function TenantProfile() {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userData)
    reset(userData)
  }, [reset])

  const onSubmit = async (data) => {
    try {
      setError('')
      setSuccess('')
      
      // In a real app, you would call an API to update the user profile
      // await api.put('/tenant/profile', data)
      
      // For now, just update localStorage
      const updatedUser = { ...user, ...data }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
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
