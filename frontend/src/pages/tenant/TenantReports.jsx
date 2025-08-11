import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material'
import {
  Report,
  Add,
  Visibility
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import api from '../../api'

export default function TenantReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm()

  const loadReports = () => {
    api.get('/tenant/reports')
      .then(r => setReports(r.data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadReports()
  }, [])

  const getStatusChip = (status) => {
    const statusConfig = {
      new: { label: 'Mới', color: 'error' },
      in_progress: { label: 'Đang xử lý', color: 'warning' },
      resolved: { label: 'Đã giải quyết', color: 'success' },
      closed: { label: 'Đã đóng', color: 'default' }
    }
    const config = statusConfig[status] || { label: status, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const getTypeChip = (type) => {
    const typeConfig = {
      maintenance: { label: 'Bảo trì', color: 'warning' },
      complaint: { label: 'Khiếu nại', color: 'error' },
      request: { label: 'Yêu cầu', color: 'info' }
    }
    const config = typeConfig[type] || { label: type, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setViewDialogOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      setError('')
      setSuccess('')
      
      // Assuming user has a current contract with room_id
      const contractData = await api.get('/tenant/contracts')
      const activeContract = contractData.data.find(c => c.status === 'active')
      
      if (!activeContract) {
        setError('Không tìm thấy hợp đồng đang hoạt động')
        return
      }

      await api.post('/tenant/reports', {
        ...data,
        room_id: activeContract.room_id
      })
      
      setSuccess('Báo cáo đã được gửi thành công!')
      setTimeout(() => {
        setDialogOpen(false)
        loadReports()
        reset()
        setSuccess('')
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <Report sx={{ mr: 1 }} />
          Báo Cáo Sự Cố
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Tạo Báo Cáo
        </Button>
      </Box>

      {loading ? (
        <Typography>Đang tải...</Typography>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Report sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có báo cáo nào
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Tạo báo cáo khi có sự cố hoặc yêu cầu hỗ trợ
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              Tạo Báo Cáo Đầu Tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Loại</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      #{report.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{getTypeChip(report.report_type)}</TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>{getStatusChip(report.status)}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<Visibility />}
                      onClick={() => handleViewReport(report)}
                      size="small"
                    >
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Report Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Tạo Báo Cáo Mới</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <TextField
              fullWidth
              label="Tiêu đề"
              margin="normal"
              {...register('title', { required: 'Tiêu đề là bắt buộc' })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <Controller
              name="report_type"
              control={control}
              defaultValue="maintenance"
              rules={{ required: 'Vui lòng chọn loại báo cáo' }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.report_type}>
                  <InputLabel>Loại báo cáo</InputLabel>
                  <Select {...field} label="Loại báo cáo">
                    <MenuItem value="maintenance">Bảo trì</MenuItem>
                    <MenuItem value="complaint">Khiếu nại</MenuItem>
                    <MenuItem value="request">Yêu cầu</MenuItem>
                  </Select>
                  {errors.report_type && (
                    <Typography variant="caption" color="error">
                      {errors.report_type.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
            
            <TextField
              fullWidth
              label="Mô tả chi tiết"
              margin="normal"
              multiline
              rows={4}
              {...register('description', { required: 'Mô tả là bắt buộc' })}
              error={!!errors.description}
              helperText={errors.description?.message || 'Hãy mô tả chi tiết vấn đề để được hỗ trợ tốt nhất'}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained">
              Gửi Báo Cáo
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết báo cáo</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedReport.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Báo cáo #{selectedReport.id} - Ngày tạo: {new Date(selectedReport.createdAt).toLocaleString('vi-VN')}
              </Typography>
              
              <Box sx={{ my: 2 }}>
                {getTypeChip(selectedReport.report_type)}
                {getStatusChip(selectedReport.status)}
              </Box>

              <Typography variant="body1" paragraph>
                <strong>Mô tả:</strong>
              </Typography>
              <Typography variant="body1" paragraph sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                {selectedReport.description || 'Không có mô tả'}
              </Typography>

              {selectedReport.status === 'resolved' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.dark">
                    ✅ Báo cáo này đã được giải quyết. Nếu vấn đề vẫn còn, vui lòng tạo báo cáo mới.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
