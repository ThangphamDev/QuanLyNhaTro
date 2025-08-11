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
  Tooltip,
  Avatar,
  Divider
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Assignment,
  Person,
  Home as RoomIcon,
  CalendarToday,
  AttachMoney,
  Download,
  Visibility,
  Close,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { vi } from 'date-fns/locale'
import api from '../../api'

export default function ContractManagement() {
  const [contracts, setContracts] = useState([])
  const [rooms, setRooms] = useState([])
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContract, setEditingContract] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm()

  const loadData = async () => {
    try {
      const [contractsRes, roomsRes, tenantsRes] = await Promise.all([
        api.get('/admin/contracts'),
        api.get('/admin/rooms'),
        api.get('/admin/tenants')
      ])
      setContracts(contractsRes.data)
      setRooms(roomsRes.data.filter(room => room.status === 'available'))
      setTenants(tenantsRes.data)
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
    setEditingContract(null)
    setError('')
    setSuccess('')
    reset({
      status: 'active',
      deposit_amount: 0
    })
    setDialogOpen(true)
  }

  const handleEdit = (contract) => {
    setEditingContract(contract)
    setError('')
    setSuccess('')
    reset({
      ...contract,
      start_date: contract.start_date ? new Date(contract.start_date) : null,
      end_date: contract.end_date ? new Date(contract.end_date) : null
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
      try {
        await api.delete(`/admin/contracts/${id}`)
        setSuccess('Xóa hợp đồng thành công!')
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
      
      const contractData = {
        ...data,
        start_date: data.start_date?.toISOString().split('T')[0],
        end_date: data.end_date?.toISOString().split('T')[0]
      }

      if (editingContract) {
        await api.put(`/admin/contracts/${editingContract.id}`, contractData)
        setSuccess('Cập nhật hợp đồng thành công!')
      } else {
        await api.post('/admin/contracts', contractData)
        setSuccess('Tạo hợp đồng thành công!')
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
      active: { label: 'Đang hiệu lực', color: 'success', icon: <CheckCircle /> },
      expired: { label: 'Hết hạn', color: 'error', icon: <Error /> },
      terminated: { label: 'Đã chấm dứt', color: 'default', icon: <Close /> }
    }
    const config = statusConfig[status] || { label: status, color: 'default', icon: <Warning /> }
    return (
      <Chip 
        label={config.label} 
        color={config.color} 
        size="small"
        icon={config.icon}
        sx={{ fontWeight: 'bold' }}
      />
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const handleTerminate = async (contract) => {
    if (!contract) return
    if (contract.status !== 'active' || !contract.is_signed) {
      setError('Chỉ chấm dứt được hợp đồng đang hiệu lực và đã ký')
      return
    }
    if (!window.confirm(`Chấm dứt hợp đồng #${contract.id}?`)) return
    try {
      setError('')
      await api.post(`/admin/contracts/${contract.id}/terminate`)
      setSuccess('Đã chấm dứt hợp đồng')
      setDetailOpen(false)
      setSelectedContract(null)
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError(e.response?.data?.message || 'Chấm dứt hợp đồng thất bại')
    }
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
          <Assignment sx={{ mr: 1 }} />
          Quản lý Hợp Đồng
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
          Tạo Hợp Đồng
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
                <CheckCircle sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Đang hiệu lực
                  </Typography>
                  <Typography variant="h4">
                    {contracts.filter(c => c.status === 'active').length}
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
                    Hết hạn
                  </Typography>
                  <Typography variant="h4">
                    {contracts.filter(c => c.status === 'expired').length}
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
                <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Tổng tiền cọc
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(contracts.reduce((sum, c) => sum + (parseFloat(c.deposit_amount) || 0), 0))}
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
                <Assignment sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Tổng hợp đồng
                  </Typography>
                  <Typography variant="h4">
                    {contracts.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Contracts Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Mã HĐ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Người thuê</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Phòng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ngày bắt đầu</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ngày kết thúc</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Tiền thuê</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Tiền cọc</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ký</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  #{contract.id}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {contract.tenant?.full_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contract.tenant?.phone_number}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RoomIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {contract.room?.room_number}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
                    {formatDate(contract.start_date)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'warning.main' }} />
                    {contract.end_date ? formatDate(contract.end_date) : 'Không xác định'}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {formatCurrency(contract.rent_price)}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {formatCurrency(contract.deposit_amount)}
                </TableCell>
                <TableCell>
                  {getStatusChip(contract.status)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={contract.is_signed ? 'Đã ký' : 'Chờ ký'}
                    color={contract.is_signed ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => { setSelectedContract(contract); setDetailOpen(true); }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sửa hợp đồng">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(contract)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Tải hợp đồng">
                      <IconButton
                        color="success"
                        size="small"
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                    {contract.status === 'active' && contract.is_signed && (
                      <Tooltip title="Chấm dứt hợp đồng">
                        <IconButton
                          color="warning"
                          size="small"
                          onClick={() => handleTerminate(contract)}
                        >
                          <Close />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Xóa hợp đồng">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(contract.id)}
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
            {editingContract ? (
              <>
                <Edit sx={{ mr: 1 }} />
                Sửa Hợp Đồng - #{editingContract.id}
              </>
            ) : (
              <>
                <Add sx={{ mr: 1 }} />
                Tạo Hợp Đồng Mới
              </>
            )}
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="room_id"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Vui lòng chọn phòng' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.room_id}>
                      <InputLabel>Phòng *</InputLabel>
                      <Select {...field} label="Phòng *">
                        {rooms.map((room) => (
                          <MenuItem key={room.id} value={room.id}>
                            {room.room_number} - {room.property?.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.room_id && (
                        <Typography variant="caption" color="error">
                          {errors.room_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="tenant_id"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Vui lòng chọn người thuê' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.tenant_id}>
                      <InputLabel>Người thuê *</InputLabel>
                      <Select {...field} label="Người thuê *">
                        {tenants.map((tenant) => (
                          <MenuItem key={tenant.id} value={tenant.id}>
                            {tenant.full_name} - {tenant.phone_number}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.tenant_id && (
                        <Typography variant="caption" color="error">
                          {errors.tenant_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <Controller
                    name="start_date"
                    control={control}
                    defaultValue={null}
                    rules={{ required: 'Vui lòng chọn ngày bắt đầu' }}
                    render={({ field }) => (
                      <DatePicker
                        label="Ngày bắt đầu *"
                        {...field}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            error={!!errors.start_date}
                            helperText={errors.start_date?.message}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <Controller
                    name="end_date"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        label="Ngày kết thúc"
                        {...field}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            error={!!errors.end_date}
                            helperText={errors.end_date?.message}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tiền thuê *"
                  type="number"
                  {...register('rent_price', { required: 'Tiền thuê là bắt buộc', min: 0 })}
                  error={!!errors.rent_price}
                  helperText={errors.rent_price?.message}
                  InputProps={{
                    endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tiền cọc"
                  type="number"
                  {...register('deposit_amount', { min: 0 })}
                  error={!!errors.deposit_amount}
                  helperText={errors.deposit_amount?.message}
                  InputProps={{
                    endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue="active"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select {...field} label="Trạng thái">
                        <MenuItem value="active">
                          <Chip label="Đang hiệu lực" color="success" size="small" sx={{ mr: 1 }} />
                          Đang hiệu lực
                        </MenuItem>
                        <MenuItem value="expired">
                          <Chip label="Hết hạn" color="error" size="small" sx={{ mr: 1 }} />
                          Hết hạn
                        </MenuItem>
                        <MenuItem value="terminated">
                          <Chip label="Đã chấm dứt" color="default" size="small" sx={{ mr: 1 }} />
                          Đã chấm dứt
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nội dung hợp đồng"
                  multiline
                  minRows={6}
                  placeholder="Nhập nội dung chi tiết hợp đồng, điều khoản, trách nhiệm..."
                  {...register('content')}
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
              startIcon={editingContract ? <Edit /> : <Add />}
            >
              {editingContract ? 'Cập nhật' : 'Tạo hợp đồng'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Contract Detail Dialog */}
      <ContractDetailDialog 
        open={detailOpen} 
        onClose={() => setDetailOpen(false)} 
        contract={selectedContract}
        onTerminate={handleTerminate}
      />
    </Box>
  )
}

// Detail Dialog Component
function ContractDetailDialog({ open, onClose, contract, onTerminate }) {
  if (!contract) return null
  const rows = [
    { label: 'Mã HĐ', value: `#${contract.id}` },
    { label: 'Người thuê', value: contract.tenant?.full_name },
    { label: 'SĐT', value: contract.tenant?.phone_number },
    { label: 'Phòng', value: contract.room?.room_number },
    { label: 'Ngày bắt đầu', value: new Date(contract.start_date).toLocaleDateString('vi-VN') },
    { label: 'Ngày kết thúc', value: contract.end_date ? new Date(contract.end_date).toLocaleDateString('vi-VN') : 'Không xác định' },
    { label: 'Tiền thuê', value: new Intl.NumberFormat('vi-VN').format(contract.rent_price) + ' VND' },
    { label: 'Tiền cọc', value: new Intl.NumberFormat('vi-VN').format(contract.deposit_amount) + ' VND' },
    { label: 'Trạng thái ký', value: contract.is_signed ? 'Đã ký' : 'Chưa ký' },
    { label: 'Thời gian ký', value: contract.signed_at ? new Date(contract.signed_at).toLocaleString('vi-VN') : '-' },
  ]
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết hợp đồng</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {rows.map(r => (
            <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
              <Typography variant="body2" color="text.secondary">{r.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{r.value}</Typography>
            </Box>
          ))}
          {contract.content && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Nội dung hợp đồng</Typography>
              <Typography variant="body2" whiteSpace="pre-line">{contract.content}</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">Đóng</Button>
        {contract.status === 'active' && contract.is_signed && (
          <Button onClick={() => onTerminate(contract)} color="warning" variant="contained">Chấm dứt hợp đồng</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
