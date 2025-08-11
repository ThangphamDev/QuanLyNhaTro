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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
  Stack,
  Tooltip
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  AttachMoney,
  Receipt,
  Payment,
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
  Visibility
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import api from '../../api'

export default function FinanceManagement() {
  const [invoices, setInvoices] = useState([])
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm()

  const loadData = async () => {
    try {
      const [invoicesRes, contractsRes] = await Promise.all([
        api.get('/admin/invoices'),
        api.get('/admin/contracts')
      ])
      setInvoices(invoicesRes.data)
      setContracts(contractsRes.data)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = () => {
    setEditingInvoice(null)
    setError('')
    setSuccess('')
    reset({
      status: 'pending',
      billing_month: new Date().getMonth() + 1,
      billing_year: new Date().getFullYear()
    })
    setDialogOpen(true)
  }

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice)
    setError('')
    setSuccess('')
    reset(invoice)
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await api.delete(`/admin/invoices/${id}`)
        setSuccess('Xóa hóa đơn thành công!')
        loadData()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        setError('Xóa thất bại: ' + (error.response?.data?.message || 'Có lỗi xảy ra'))
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      setError('')
      setSuccess('')

      const payload = {
        contract_id: data.contract_id ? Number(data.contract_id) : undefined,
        total_amount: data.total_amount !== undefined ? Number(data.total_amount) : undefined,
        billing_month: data.billing_month !== undefined ? Number(data.billing_month) : undefined,
        billing_year: data.billing_year !== undefined ? Number(data.billing_year) : undefined,
        status: data.status || 'pending'
      }

      if (editingInvoice) {
        await api.put(`/admin/invoices/${editingInvoice.id}`, payload)
        setSuccess('Cập nhật hóa đơn thành công!')
      } else {
        await api.post('/admin/invoices', payload)
        setSuccess('Tạo hóa đơn thành công!')
      }
      
      setDialogOpen(false)
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ thanh toán', color: 'warning' },
      paid: { label: 'Đã thanh toán', color: 'success' },
      overdue: { label: 'Quá hạn', color: 'error' },
      cancelled: { label: 'Đã hủy', color: 'default' }
    }
    const config = statusConfig[status] || { label: status, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  const calculateTotalRevenue = () => {
    return invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + (parseFloat(invoice.total_amount) || 0), 0)
  }

  const calculatePendingAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + (parseFloat(invoice.total_amount) || 0), 0)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6" color="text.secondary">
          Đang tải dữ liệu...
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <AttachMoney sx={{ mr: 1 }} />
          Quản lý Tài Chính
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-1px)'
            }
          }}
        >
          Tạo Hóa Đơn
        </Button>
      </Box>

      {/* Success Alert */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)', 
            color: 'white',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Tổng doanh thu
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(calculateTotalRevenue())}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)', 
            color: 'white',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Receipt sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Chờ thanh toán
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(calculatePendingAmount())}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', 
            color: 'white',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Đã thanh toán
                  </Typography>
                  <Typography variant="h4">
                    {invoices.filter(i => i.status === 'paid').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #F44336 30%, #E91E63 90%)', 
            color: 'white',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Error sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Quá hạn
                  </Typography>
                  <Typography variant="h4">
                    {invoices.filter(i => i.status === 'overdue').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Invoices Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Mã HĐ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Hợp đồng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Tháng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Số tiền</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  #{invoice.id}
                </TableCell>
                <TableCell>
                  HĐ #{invoice.contract_id}
                </TableCell>
                <TableCell>
                  {invoice.billing_month}/{invoice.billing_year}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {formatCurrency(invoice.total_amount)}
                </TableCell>
                <TableCell>
                  {getStatusChip(invoice.status)}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        color="primary"
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sửa hóa đơn">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(invoice)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa hóa đơn">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(invoice.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center',
            py: 2
          }}>
            {editingInvoice ? (
              <>
                <Edit sx={{ mr: 1 }} />
                Sửa Hóa Đơn - #{editingInvoice.id}
              </>
            ) : (
              <>
                <Add sx={{ mr: 1 }} />
                Tạo Hóa Đơn Mới
              </>
            )}
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="contract_id"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Vui lòng chọn hợp đồng' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.contract_id}>
                      <InputLabel>Hợp đồng *</InputLabel>
                      <Select {...field} label="Hợp đồng *">
                        {contracts.map((contract) => (
                          <MenuItem key={contract.id} value={contract.id}>
                            HĐ #{contract.id} - {contract.room?.room_number}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.contract_id && (
                        <Typography variant="caption" color="error">
                          {errors.contract_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số tiền *"
                  type="number"
                  {...register('total_amount', { required: 'Số tiền là bắt buộc', min: 0 })}
                  error={!!errors.total_amount}
                  helperText={errors.total_amount?.message}
                  InputProps={{
                    endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tháng *"
                  type="number"
                  {...register('billing_month', { required: 'Tháng là bắt buộc', min: 1, max: 12 })}
                  error={!!errors.billing_month}
                  helperText={errors.billing_month?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Năm *"
                  type="number"
                  {...register('billing_year', { required: 'Năm là bắt buộc', min: 2020 })}
                  error={!!errors.billing_year}
                  helperText={errors.billing_year?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue="pending"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select {...field} label="Trạng thái">
                        <MenuItem value="pending">
                          <Chip label="Chờ thanh toán" color="warning" size="small" sx={{ mr: 1 }} />
                          Chờ thanh toán
                        </MenuItem>
                        <MenuItem value="paid">
                          <Chip label="Đã thanh toán" color="success" size="small" sx={{ mr: 1 }} />
                          Đã thanh toán
                        </MenuItem>
                        <MenuItem value="overdue">
                          <Chip label="Quá hạn" color="error" size="small" sx={{ mr: 1 }} />
                          Quá hạn
                        </MenuItem>
                        <MenuItem value="cancelled">
                          <Chip label="Đã hủy" color="default" size="small" sx={{ mr: 1 }} />
                          Đã hủy
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              onClick={() => setDialogOpen(false)}
              variant="outlined"
              size="large"
              sx={{ 
                minWidth: 140,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              size="large"
              sx={{ 
                minWidth: 140,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
              startIcon={editingInvoice ? <Edit /> : <Add />}
            >
              {editingInvoice ? 'Cập nhật' : 'Tạo hóa đơn'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
