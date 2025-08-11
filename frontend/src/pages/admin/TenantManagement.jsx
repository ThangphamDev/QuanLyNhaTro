import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Avatar
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  People,
  Email,
  Phone
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import api from '../../api'

const schema = yup.object({
  full_name: yup.string().required('Họ tên là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phone_number: yup.string().required('Số điện thoại là bắt buộc'),
  password: yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Mật khẩu là bắt buộc')
})

export default function TenantManagement() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const loadTenants = () => {
    api.get('/admin/tenants')
      .then(r => setTenants(r.data))
      .catch(() => setTenants([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTenants()
  }, [])

  const handleAdd = () => {
    setEditingTenant(null)
    reset()
    setDialogOpen(true)
  }

  const handleEdit = (tenant) => {
    setEditingTenant(tenant)
    reset({ 
      full_name: tenant.full_name,
      email: tenant.email,
      phone_number: tenant.phone_number
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người thuê này?')) {
      try {
        // Note: You might need to add a delete endpoint for tenants
        alert('Chức năng xóa người thuê sẽ được cập nhật sau')
      } catch (error) {
        alert('Xóa thất bại')
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      setError('')
      setSuccess('')
      
      if (editingTenant) {
        // Update tenant - you might need to add this endpoint
        alert('Chức năng sửa thông tin sẽ được cập nhật sau')
      } else {
        // Create new tenant
        await api.post('/auth/admin/create-tenant', data)
        setSuccess('Tạo tài khoản thành công!')
        setTimeout(() => {
          setDialogOpen(false)
          loadTenants()
          setSuccess('')
        }, 2000)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <People sx={{ mr: 1 }} />
          Quản lý Người Thuê
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Thêm Người Thuê
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Thông tin</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {tenant.full_name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {tenant.full_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {tenant.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    {tenant.email}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    {tenant.phone_number || 'Chưa cập nhật'}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(tenant.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: tenant.is_active ? 'success.main' : 'error.main',
                      fontWeight: 'bold'
                    }}
                  >
                    {tenant.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(tenant)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(tenant.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingTenant ? 'Sửa Thông Tin Người Thuê' : 'Thêm Người Thuê Mới'}
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <TextField
              fullWidth
              label="Họ và tên"
              margin="normal"
              {...register('full_name')}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <TextField
              fullWidth
              label="Số điện thoại"
              margin="normal"
              {...register('phone_number')}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />

            {!editingTenant && (
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message || 'Mật khẩu tạm thời cho người thuê'}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained">
              {editingTenant ? 'Cập nhật' : 'Tạo tài khoản'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
