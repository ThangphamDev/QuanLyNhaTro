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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Divider,
  Tabs,
  Tab
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Inventory,
  Business,
  Home as RoomIcon,
  CalendarToday,
  AttachMoney,
  Visibility,
  Close,
  CheckCircle,
  Warning,
  Error,
  Storage,
  Build,
  DeleteForever,
  Info,
  Settings
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { vi } from 'date-fns/locale'
import api from '../../api'

export default function AssetManagement() {
  const [assets, setAssets] = useState([])
  const [properties, setProperties] = useState([])
  const [rooms, setRooms] = useState([])
  const [assetTypes, setAssetTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentTab, setCurrentTab] = useState(0)
  const [dialogTab, setDialogTab] = useState(0)
  const [expandedTypes, setExpandedTypes] = useState({})

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm()

  const loadData = async () => {
    try {
      const [assetsRes, propertiesRes, roomsRes, assetTypesRes] = await Promise.all([
        api.get('/admin/assets'),
        api.get('/admin/properties'),
        api.get('/admin/rooms'),
        api.get('/admin/asset-types')
      ])
      setAssets(assetsRes.data)
      setProperties(propertiesRes.data)
      setRooms(roomsRes.data)
      setAssetTypes(assetTypesRes.data)
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
    setEditingAsset(null)
    setError('')
    setSuccess('')
    setDialogTab(0)
    reset({
      status: 'in_use',
      value: 0
    })
    setDialogOpen(true)
  }

  const handleEdit = (asset) => {
    setEditingAsset(asset)
    setError('')
    setSuccess('')
    setDialogTab(0)
    reset({
      ...asset,
      purchase_date: asset.purchase_date ? new Date(asset.purchase_date) : null,
      warranty_end_date: asset.warranty_end_date ? new Date(asset.warranty_end_date) : null
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài sản này?')) {
      try {
        await api.delete(`/admin/assets/${id}`)
        setSuccess('Xóa tài sản thành công!')
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
      
      if (editingAsset) {
        // Editing existing asset
        const assetData = {
          ...data,
          purchase_date: data.purchase_date?.toISOString().split('T')[0],
          warranty_end_date: data.warranty_end_date?.toISOString().split('T')[0]
        }
        await api.put(`/admin/assets/${editingAsset.id}`, assetData)
        setSuccess('Cập nhật tài sản thành công!')
      } else {
        // Creating new asset(s)
        if (dialogTab === 0) {
          // Single asset creation
          const assetData = {
            ...data,
            purchase_date: data.purchase_date?.toISOString().split('T')[0],
            warranty_end_date: data.warranty_end_date?.toISOString().split('T')[0],
            quantity: parseInt(data.quantity) || 1
          }
          await api.post('/admin/assets', assetData)
          setSuccess('Tạo tài sản thành công!')
        } else {
          // Bulk asset creation
          const bulkData = {
            ...data,
            purchase_date: data.purchase_date?.toISOString().split('T')[0],
            warranty_end_date: data.warranty_end_date?.toISOString().split('T')[0],
            quantity: parseInt(data.quantity) || 1
          }
          const response = await api.post('/admin/assets/bulk', bulkData)
          setSuccess(`Tạo thành công tài sản với số lượng ${response.data.quantity}!`)
        }
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
      in_use: { label: 'Đang sử dụng', color: 'success', icon: <CheckCircle /> },
      in_storage: { label: 'Trong kho', color: 'info', icon: <Storage /> },
      under_repair: { label: 'Đang sửa', color: 'warning', icon: <Build /> },
      disposed: { label: 'Đã thanh lý', color: 'error', icon: <DeleteForever /> }
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
    if (!dateString) return 'Không xác định'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  const getAssetsByStatus = (status) => {
    return assets.filter(asset => asset.status === status)
  }

  const getFilteredAssets = () => {
    if (currentTab === 1) return getAssetsByStatus('in_use')
    if (currentTab === 2) return getAssetsByStatus('in_storage')
    if (currentTab === 3) return getAssetsByStatus('under_repair')
    return assets
  }

  const toggleType = (typeId) => {
    setExpandedTypes((prev) => ({ ...prev, [typeId]: !prev[typeId] }))
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
          <Inventory sx={{ mr: 1 }} />
          Quản lý Tài Sản
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
          Thêm Tài Sản
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
                    Đang sử dụng
                  </Typography>
                  <Typography variant="h4">
                    {getAssetsByStatus('in_use').length}
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
                <Storage sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Trong kho
                  </Typography>
                  <Typography variant="h4">
                    {getAssetsByStatus('in_storage').length}
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
                <Build sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Đang sửa
                  </Typography>
                  <Typography variant="h4">
                    {getAssetsByStatus('under_repair').length}
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
                <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Tổng giá trị
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(assets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0))}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              '&.Mui-selected': {
                color: 'primary.main'
              }
            }
          }}
        >
          <Tab 
            icon={<Inventory sx={{ mb: 1 }} />} 
            label="Tất cả tài sản" 
            iconPosition="top"
          />
          <Tab 
            icon={<CheckCircle sx={{ mb: 1 }} />} 
            label="Đang sử dụng" 
            iconPosition="top"
          />
          <Tab 
            icon={<Storage sx={{ mb: 1 }} />} 
            label="Trong kho" 
            iconPosition="top"
          />
          <Tab 
            icon={<Build sx={{ mb: 1 }} />} 
            label="Đang sửa" 
            iconPosition="top"
          />
        </Tabs>
      </Box>
      
      {/* Assets grouped by type with collapsible sections */}
      {(() => {
        const filteredAssets = getFilteredAssets()
        const total = filteredAssets.length
        if (total === 0) {
          return (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography color="text.secondary">Không có tài sản phù hợp bộ lọc.</Typography>
            </Paper>
          )
        }

        return (
          <Box>
            {assetTypes.map((type) => {
              const items = filteredAssets.filter((a) => a.asset_type_id === type.id)
              const count = items.length
              if (count === 0) return null
              return (
                <Accordion key={type.id} expanded={!!expandedTypes[type.id]} onChange={() => toggleType(type.id)} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
                  <AccordionSummary expandIcon={<Settings />} sx={{ bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={type.name} color="primary" />
                        <Typography variant="body2" color="text.secondary">{count} tài sản</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip size="small" color="success" label={`Đang dùng: ${items.filter(i => i.status === 'in_use').length}`} />
                        <Chip size="small" color="info" label={`Trong kho: ${items.filter(i => i.status === 'in_storage').length}`} />
                        <Chip size="small" color="warning" label={`Sửa chữa: ${items.filter(i => i.status === 'under_repair').length}`} />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'primary.main' }}>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Mã TS</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Tên tài sản</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Khu trọ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Phòng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Số lượng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Giá trị</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {items.map((asset) => (
                            <TableRow key={asset.id} hover>
                              <TableCell sx={{ fontWeight: 'bold' }}>#{asset.id}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: 'primary.main' }}>
                                    <Inventory />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{asset.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{asset.serial_number}</Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Business sx={{ mr: 1, color: 'primary.main' }} />
                                  <Typography variant="body2">{asset.property?.name || 'N/A'}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <RoomIcon sx={{ mr: 1, color: 'success.main' }} />
                                  <Typography variant="body2">{asset.room?.room_number || 'N/A'}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip label={asset.quantity || 1} color="secondary" size="small" sx={{ fontWeight: 'bold' }} />
                              </TableCell>
                              <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>{formatCurrency(asset.value)}</TableCell>
                              <TableCell>{getStatusChip(asset.status)}</TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <Tooltip title="Xem chi tiết">
                                    <IconButton color="primary" size="small">
                                      <Visibility />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Sửa tài sản">
                                    <IconButton color="primary" onClick={() => handleEdit(asset)} size="small">
                                      <Edit />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Xóa tài sản">
                                    <IconButton color="error" onClick={() => handleDelete(asset.id)} size="small">
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
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Box>
        )
      })()}

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
            {editingAsset ? (
              <>
                <Edit sx={{ mr: 1 }} />
                Sửa Tài Sản - #{editingAsset.id}
              </>
            ) : (
              <>
                <Add sx={{ mr: 1 }} />
                Thêm Tài Sản Mới
              </>
            )}
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={dialogTab} 
                onChange={(e, newValue) => setDialogTab(newValue)}
                sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold' } }}
              >
                <Tab label="Tạo tài sản đơn lẻ" />
                <Tab label="Tạo nhiều tài sản" />
              </Tabs>
            </Box>
            
            {dialogTab === 0 && (
              <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="property_id"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Vui lòng chọn khu trọ' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.property_id}>
                      <InputLabel>Khu trọ *</InputLabel>
                      <Select {...field} label="Khu trọ *">
                        {properties.map((property) => (
                          <MenuItem key={property.id} value={property.id}>
                            {property.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.property_id && (
                        <Typography variant="caption" color="error">
                          {errors.property_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="room_id"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Phòng (tùy chọn)</InputLabel>
                      <Select {...field} label="Phòng (tùy chọn)">
                        <MenuItem value="">Không gán phòng</MenuItem>
                        {rooms.map((room) => (
                          <MenuItem key={room.id} value={room.id}>
                            {room.room_number} - {room.property?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="asset_type_id"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Vui lòng chọn loại tài sản' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.asset_type_id}>
                      <InputLabel>Loại tài sản *</InputLabel>
                      <Select {...field} label="Loại tài sản *">
                        {assetTypes.map((type) => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.asset_type_id && (
                        <Typography variant="caption" color="error">
                          {errors.asset_type_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên tài sản *"
                  {...register('name', { required: 'Tên tài sản là bắt buộc' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="VD: Tủ lạnh Samsung..."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số serial"
                  {...register('serial_number')}
                  placeholder="VD: ABC123456..."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số lượng"
                  type="number"
                  {...register('quantity', { 
                    min: { value: 1, message: 'Số lượng phải lớn hơn 0' },
                    max: { value: 100, message: 'Số lượng không được vượt quá 100' }
                  })}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  placeholder="1"
                  defaultValue="1"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Giá trị *"
                  type="number"
                  {...register('value', { required: 'Giá trị là bắt buộc', min: 0 })}
                  error={!!errors.value}
                  helperText={errors.value?.message}
                  InputProps={{
                    endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <Controller
                    name="purchase_date"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        label="Ngày mua"
                        {...field}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <Controller
                    name="warranty_end_date"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        label="Ngày hết bảo hành"
                        {...field}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue="in_use"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select {...field} label="Trạng thái">
                        <MenuItem value="in_use">
                          <Chip label="Đang sử dụng" color="success" size="small" sx={{ mr: 1 }} />
                          Đang sử dụng
                        </MenuItem>
                        <MenuItem value="in_storage">
                          <Chip label="Trong kho" color="info" size="small" sx={{ mr: 1 }} />
                          Trong kho
                        </MenuItem>
                        <MenuItem value="under_repair">
                          <Chip label="Đang sửa" color="warning" size="small" sx={{ mr: 1 }} />
                          Đang sửa
                        </MenuItem>
                        <MenuItem value="disposed">
                          <Chip label="Đã thanh lý" color="error" size="small" sx={{ mr: 1 }} />
                          Đã thanh lý
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  multiline
                  rows={3}
                  {...register('notes')}
                  placeholder="Ghi chú về tình trạng, bảo hành, vị trí..."
                />
              </Grid>
            </Grid>
            )}
            
            {dialogTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="property_id"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Vui lòng chọn khu trọ' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.property_id}>
                        <InputLabel>Khu trọ *</InputLabel>
                        <Select {...field} label="Khu trọ *">
                          {properties.map((property) => (
                            <MenuItem key={property.id} value={property.id}>
                              {property.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.property_id && (
                          <Typography variant="caption" color="error">
                            {errors.property_id.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="asset_type_id"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Vui lòng chọn loại tài sản' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.asset_type_id}>
                        <InputLabel>Loại tài sản *</InputLabel>
                        <Select {...field} label="Loại tài sản *">
                          {assetTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.asset_type_id && (
                          <Typography variant="caption" color="error">
                            {errors.asset_type_id.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên tài sản *"
                    {...register('name', { required: 'Vui lòng nhập tên tài sản' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    placeholder="Ví dụ: Ghế văn phòng, Tủ lạnh Samsung..."
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số lượng *"
                    type="number"
                    {...register('quantity', { 
                      required: 'Vui lòng nhập số lượng',
                      min: { value: 1, message: 'Số lượng phải lớn hơn 0' },
                      max: { value: 100, message: 'Số lượng không được vượt quá 100' }
                    })}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    placeholder="1"
                    defaultValue="1"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Giá trị (VNĐ)"
                    type="number"
                    {...register('value')}
                    placeholder="0"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <Controller
                      name="purchase_date"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DatePicker
                          label="Ngày mua"
                          {...field}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <Controller
                      name="warranty_end_date"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DatePicker
                          label="Ngày hết bảo hành"
                          {...field}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ghi chú"
                    multiline
                    rows={3}
                    {...register('notes')}
                    placeholder="Ghi chú về tình trạng, bảo hành, vị trí..."
                  />
                </Grid>
              </Grid>
            )}
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
              startIcon={editingAsset ? <Edit /> : <Add />}
            >
              {editingAsset ? 'Cập nhật' : (dialogTab === 0 ? 'Tạo tài sản' : 'Tạo nhiều tài sản')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
