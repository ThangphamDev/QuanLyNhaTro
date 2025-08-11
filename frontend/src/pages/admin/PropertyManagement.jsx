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
  Alert
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Business
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import api from '../../api'

export default function PropertyManagement() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const loadProperties = () => {
    api.get('/admin/properties')
      .then(r => setProperties(r.data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleAdd = () => {
    setEditingProperty(null)
    reset()
    setDialogOpen(true)
  }

  const handleEdit = (property) => {
    setEditingProperty(property)
    reset(property)
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khu trọ này?')) {
      try {
        await api.delete(`/admin/properties/${id}`)
        loadProperties()
      } catch (error) {
        alert('Xóa thất bại')
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      setError('')
      if (editingProperty) {
        await api.put(`/admin/properties/${editingProperty.id}`, data)
      } else {
        await api.post('/admin/properties', data)
      }
      setDialogOpen(false)
      loadProperties()
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <Business sx={{ mr: 1 }} />
          Quản lý Khu Trọ
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Thêm Khu Trọ
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên khu trọ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Địa chỉ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id} hover>
                <TableCell>{property.id}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{property.name}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>
                  {new Date(property.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(property)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(property.id)}
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
            {editingProperty ? 'Sửa Khu Trọ' : 'Thêm Khu Trọ Mới'}
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TextField
              fullWidth
              label="Tên khu trọ"
              margin="normal"
              {...register('name', { required: 'Tên khu trọ là bắt buộc' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            
            <TextField
              fullWidth
              label="Địa chỉ"
              margin="normal"
              multiline
              rows={3}
              {...register('address', { required: 'Địa chỉ là bắt buộc' })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained">
              {editingProperty ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
