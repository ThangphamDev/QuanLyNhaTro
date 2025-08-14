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
  Tabs,
  Tab
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
  const [activeTab, setActiveTab] = useState(0)

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm()

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
    setActiveTab(0)
    reset({
      contract_id: '',
      status: 'pending',
      billing_month: new Date().getMonth() + 1,
      billing_year: new Date().getFullYear(),
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      electricity_old: 0,
      electricity_new: 0,
      electricity_rate: 4000,
      water_old: 0,
      water_new: 0,
      water_rate: 15000
    })
    setDialogOpen(true)
  }

  // Kiểm tra xem hợp đồng đã có hóa đơn chưa thanh toán chưa
  const checkContractHasUnpaidInvoices = (contractId) => {
    if (!contractId) return false;
    return invoices.some(invoice => 
      invoice.contract_id === contractId && 
      invoice.status !== 'paid'
    );
  }

  // Lấy chỉ số cũ khi chọn hợp đồng
  const handleContractChange = async (contractId) => {
    if (!contractId) return;
    
    try {
      const contract = contracts.find(c => c.id == contractId);
      if (contract?.room?.id) {
        const response = await api.get(`/admin/utility-readings/latest/${contract.room.id}`);
        const latestReadings = response.data;
        
        // Cập nhật form với chỉ số cũ
        reset({
          ...watch(),
          electricity_old: latestReadings.electricity || 0,
          water_old: latestReadings.water || 0
        });
      }
    } catch (error) {
      console.log('Không thể lấy chỉ số cũ:', error);
    }
  }

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice)
    setError('')
    setSuccess('')
    setActiveTab(0)
    
    // Parse dữ liệu từ invoice_items để lấy thông tin điện nước
    let electricityOld = 0, electricityNew = 0, electricityRate = 4000;
    let waterOld = 0, waterNew = 0, waterRate = 15000;
    
    if (invoice.invoice_items && invoice.invoice_items.length > 0) {
      // Tìm item điện
      const electricityItem = invoice.invoice_items.find(item => 
        item.description.includes('Điện:')
      );
      if (electricityItem) {
        // Parse description: "Điện: 100 → 200 kWh (4,000 VND/kWh)"
        const match = electricityItem.description.match(/Điện: (\d+(?:\.\d+)?) → (\d+(?:\.\d+)?) kWh \(([\d,]+) VND\/kWh\)/);
        if (match) {
          electricityOld = parseFloat(match[1]);
          electricityNew = parseFloat(match[2]);
          electricityRate = parseFloat(match[3].replace(/,/g, ''));
        }
      }
      
      // Tìm item nước
      const waterItem = invoice.invoice_items.find(item => 
        item.description.includes('Nước:')
      );
      if (waterItem) {
        // Parse description: "Nước: 50 → 60 m³ (15,000 VND/m³)"
        const match = waterItem.description.match(/Nước: (\d+(?:\.\d+)?) → (\d+(?:\.\d+)?) m³ \(([\d,]+) VND\/m³\)/);
        if (match) {
          waterOld = parseFloat(match[1]);
          waterNew = parseFloat(match[2]);
          waterRate = parseFloat(match[3].replace(/,/g, ''));
        }
      }
    }
    
    // Reset form với dữ liệu đã parse
    reset({
      ...invoice,
      electricity_old: electricityOld,
      electricity_new: electricityNew,
      electricity_rate: electricityRate,
      water_old: waterOld,
      water_new: waterNew,
      water_rate: waterRate
    })
    
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

      // Tính toán chi phí điện nước
      const electricityOld = Number(data.electricity_old) || 0;
      const electricityNew = Number(data.electricity_new) || 0;
      const electricityRate = Number(data.electricity_rate) || 4000;
      const electricityCost = Math.max(0, (electricityNew - electricityOld) * electricityRate);

      const waterOld = Number(data.water_old) || 0;
      const waterNew = Number(data.water_new) || 0;
      const waterRate = Number(data.water_rate) || 15000;
      const waterCost = Math.max(0, (waterNew - waterOld) * waterRate);

      // Lấy giá tiền phòng từ hợp đồng
      const selectedContract = contracts.find(c => c.id == data.contract_id);
      const roomFee = Number(selectedContract?.room?.rent_price) || 0;
      const totalAmount = roomFee + electricityCost + waterCost;

      const payload = {
        contract_id: data.contract_id ? Number(data.contract_id) : undefined,
        total_amount: totalAmount,
        billing_month: data.billing_month !== undefined ? Number(data.billing_month) : undefined,
        billing_year: data.billing_year !== undefined ? Number(data.billing_year) : undefined,
        status: data.status || 'pending',
        // Thêm thông tin điện nước
        electricity_old: electricityOld,
        electricity_new: electricityNew,
        electricity_rate: electricityRate,
        water_old: waterOld,
        water_new: waterNew,
        water_rate: waterRate
      }

      if (editingInvoice) {
        const response = await api.put(`/admin/invoices/${editingInvoice.id}`, payload)
        setSuccess('Cập nhật hóa đơn thành công!')
        // Cập nhật lại dữ liệu trong state
        setInvoices(prev => prev.map(inv => 
          inv.id === editingInvoice.id ? response.data : inv
        ))
      } else {
        await api.post('/admin/invoices', payload)
        setSuccess('Tạo hóa đơn thành công!')
      }
      
      setDialogOpen(false)
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
      
      // Nếu lỗi về hóa đơn chưa thanh toán, reload data để cập nhật danh sách
      if (errorMessage.includes('hóa đơn chưa thanh toán')) {
        loadData();
      }
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
                  HĐ #{invoice.contract_id} - {invoice.contract?.room?.room_number}
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
          
                     <DialogContent sx={{ p: 0 }}>
             {error && <Alert severity="error" sx={{ m: 3, mb: 0 }}>{error}</Alert>}
             
             {/* Tabs */}
             <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
               <Tabs 
                 value={activeTab} 
                 onChange={(e, newValue) => setActiveTab(newValue)}
                 sx={{ px: 3 }}
               >
                 <Tab label="📋 Thông tin chung" />
                 <Tab label="⚡ Điện nước" />
                 <Tab label="💰 Tổng tiền" />
               </Tabs>
             </Box>
             
             {/* Tab Content */}
             <Box sx={{ p: 3 }}>
               {/* Tab 1: Thông tin chung */}
               {activeTab === 0 && (
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
                       <Select 
                         {...field} 
                         label="Hợp đồng *"
                         onChange={(e) => {
                           field.onChange(e);
                           handleContractChange(e.target.value);
                         }}
                       >
                         {contracts
                           .filter(contract => !checkContractHasUnpaidInvoices(contract.id))
                           .map((contract) => (
                             <MenuItem key={contract.id} value={contract.id}>
                               HĐ #{contract.id} - {contract.room?.room_number}
                             </MenuItem>
                           ))}
                         {contracts.filter(contract => !checkContractHasUnpaidInvoices(contract.id)).length === 0 && (
                           <MenuItem disabled>
                             Không có hợp đồng khả dụng (tất cả đều có hóa đơn chưa thanh toán)
                           </MenuItem>
                         )}
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
               )}
               
                               {/* Tab 2: Điện nước */}
                {activeTab === 1 && (
                  <Box>
                    {/* Điện */}
                    <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                          ⚡ Điện
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              fullWidth
                              label="Số cũ"
                              type="number"
                              {...register('electricity_old', { min: 0 })}
                              error={!!errors.electricity_old}
                              helperText={errors.electricity_old?.message}
                              InputProps={{
                                endAdornment: <Typography variant="body2" color="text.secondary">kWh</Typography>
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              fullWidth
                              label="Số mới"
                              type="number"
                              {...register('electricity_new', { min: 0 })}
                              error={!!errors.electricity_new}
                              helperText={errors.electricity_new?.message}
                              InputProps={{
                                endAdornment: <Typography variant="body2" color="text.secondary">kWh</Typography>
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              fullWidth
                              label="Đơn giá"
                              type="number"
                              defaultValue={4000}
                              {...register('electricity_rate', { min: 0 })}
                              error={!!errors.electricity_rate}
                              helperText={errors.electricity_rate?.message}
                              InputProps={{
                                endAdornment: <Typography variant="body2" color="text.secondary">VND/kWh</Typography>
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              fullWidth
                              label="Thành tiền điện"
                              type="number"
                              disabled
                              value={(() => {
                                const old = Number(watch('electricity_old')) || 0;
                                const new_ = Number(watch('electricity_new')) || 0;
                                const rate = Number(watch('electricity_rate')) || 4000;
                                return Math.max(0, (new_ - old) * rate);
                              })()}
                              sx={{
                                '& .MuiInputBase-input': {
                                  fontWeight: 'bold',
                                  color: 'success.main'
                                }
                              }}
                              InputProps={{
                                endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    {/* Nước */}
                    <Card sx={{ border: '2px solid', borderColor: 'info.main' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'info.main', display: 'flex', alignItems: 'center' }}>
                          💧 Nước
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              fullWidth
                              label="Số cũ"
                              type="number"
                              {...register('water_old', { min: 0 })}
                              error={!!errors.water_old}
                              helperText={errors.water_old?.message}
                              InputProps={{
                                endAdornment: <Typography variant="body2" color="text.secondary">m³</Typography>
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              fullWidth
                              label="Số mới"
                              type="number"
                              {...register('water_new', { min: 0 })}
                              error={!!errors.water_new}
                              helperText={errors.water_new?.message}
                              InputProps={{
                                endAdornment: <Typography variant="body2" color="text.secondary">m³</Typography>
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              fullWidth
                              label="Đơn giá"
                              type="number"
                              defaultValue={15000}
                              {...register('water_rate', { min: 0 })}
                              error={!!errors.water_rate}
                              helperText={errors.water_rate?.message}
                              InputProps={{
                                endAdornment: <Typography variant="body2" color="text.secondary">VND/m³</Typography>
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                              fullWidth
                              label="Thành tiền nước"
                              type="number"
                              disabled
                              value={(() => {
                                const old = Number(watch('water_old')) || 0;
                                const new_ = Number(watch('water_new')) || 0;
                                const rate = Number(watch('water_rate')) || 15000;
                                return Math.max(0, (new_ - old) * rate);
                              })()}
                              sx={{
                                '& .MuiInputBase-input': {
                                  fontWeight: 'bold',
                                  color: 'success.main'
                                }
                              }}
                              InputProps={{
                                endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                )}
               
               {/* Tab 3: Tổng tiền */}
               {activeTab === 2 && (
                 <Grid container spacing={3}>
                   <Grid item xs={12}>
                     <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'success.main', borderBottom: '2px solid', borderColor: 'success.main', pb: 1 }}>
                       💰 Tổng tiền
                     </Typography>
                   </Grid>
                   
                   <Grid item xs={12} sm={6}>
                     <TextField
                       fullWidth
                       label="Tiền phòng (từ hợp đồng)"
                       type="number"
                       disabled
                       value={(() => {
                         const selectedContractId = watch('contract_id');
                         const selectedContract = contracts.find(c => c.id == selectedContractId);
                         return selectedContract?.room?.rent_price || 0;
                       })()}
                       InputProps={{
                         endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                       }}
                     />
                   </Grid>
                   
                   <Grid item xs={12} sm={6}>
                     <TextField
                       fullWidth
                       label="Tổng cộng"
                       type="number"
                       disabled
                       value={(() => {
                         const selectedContractId = watch('contract_id');
                         const selectedContract = contracts.find(c => c.id == selectedContractId);
                         const roomFee = Number(selectedContract?.room?.rent_price) || 0;
                         
                         const electricityOld = Number(watch('electricity_old')) || 0;
                         const electricityNew = Number(watch('electricity_new')) || 0;
                         const electricityRate = Number(watch('electricity_rate')) || 4000;
                         
                         const waterOld = Number(watch('water_old')) || 0;
                         const waterNew = Number(watch('water_new')) || 0;
                         const waterRate = Number(watch('water_rate')) || 15000;
                         
                         const electricityCost = Math.max(0, (electricityNew - electricityOld) * electricityRate);
                         const waterCost = Math.max(0, (waterNew - waterOld) * waterRate);
                         
                         return roomFee + electricityCost + waterCost;
                       })()}
                       InputProps={{
                         endAdornment: <Typography variant="body2" color="text.secondary">VND</Typography>
                       }}
                     />
                   </Grid>
                   
                   {/* Hiển thị chi tiết tính toán */}
                   <Grid item xs={12}>
                     <Card sx={{ mt: 2, bgcolor: 'grey.50' }}>
                       <CardContent>
                         <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                           📊 Chi tiết tính toán
                         </Typography>
                         <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                             <Typography variant="body2" color="text.secondary">
                               Tiền phòng: {(() => {
                                 const selectedContractId = watch('contract_id');
                                 const selectedContract = contracts.find(c => c.id == selectedContractId);
                                 return new Intl.NumberFormat('vi-VN').format(selectedContract?.room?.rent_price || 0) + ' VND';
                               })()}
                             </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <Typography variant="body2" color="text.secondary">
                               Tiền điện: {(() => {
                                 const old = Number(watch('electricity_old')) || 0;
                                 const new_ = Number(watch('electricity_new')) || 0;
                                 const rate = Number(watch('electricity_rate')) || 4000;
                                 const cost = Math.max(0, (new_ - old) * rate);
                                 return new Intl.NumberFormat('vi-VN').format(cost) + ' VND';
                               })()}
                             </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <Typography variant="body2" color="text.secondary">
                               Tiền nước: {(() => {
                                 const old = Number(watch('water_old')) || 0;
                                 const new_ = Number(watch('water_new')) || 0;
                                 const rate = Number(watch('water_rate')) || 15000;
                                 const cost = Math.max(0, (new_ - old) * rate);
                                 return new Intl.NumberFormat('vi-VN').format(cost) + ' VND';
                               })()}
                             </Typography>
                           </Grid>
                           <Grid item xs={12} sm={6}>
                             <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                               Tổng cộng: {(() => {
                                 const selectedContractId = watch('contract_id');
                                 const selectedContract = contracts.find(c => c.id == selectedContractId);
                                 const roomFee = Number(selectedContract?.room?.rent_price) || 0;
                                 
                                 const electricityOld = Number(watch('electricity_old')) || 0;
                                 const electricityNew = Number(watch('electricity_new')) || 0;
                                 const electricityRate = Number(watch('electricity_rate')) || 4000;
                                 
                                 const waterOld = Number(watch('water_old')) || 0;
                                 const waterNew = Number(watch('water_new')) || 0;
                                 const waterRate = Number(watch('water_rate')) || 15000;
                                 
                                 const electricityCost = Math.max(0, (electricityNew - electricityOld) * electricityRate);
                                 const waterCost = Math.max(0, (waterNew - waterOld) * waterRate);
                                 
                                 return new Intl.NumberFormat('vi-VN').format(roomFee + electricityCost + waterCost) + ' VND';
                               })()}
                             </Typography>
                           </Grid>
                         </Grid>
                       </CardContent>
                     </Card>
                   </Grid>
                 </Grid>
               )}
             </Box>
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
