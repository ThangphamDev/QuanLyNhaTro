import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
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
  MenuItem
} from '@mui/material'
import {
  Report,
  Visibility
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import api from '../../api'

export default function ReportManagement() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  const { control, handleSubmit, reset } = useForm()

  const loadReports = () => {
    api.get('/admin/reports')
      .then(r => setReports(r.data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadReports()
  }, [])

  const handleViewReport = (report) => {
    setSelectedReport(report)
    reset({ status: report.status })
    setDialogOpen(true)
  }

  const handleUpdateStatus = async (data) => {
    try {
      await api.put(`/admin/reports/${selectedReport.id}`, data)
      setDialogOpen(false)
      loadReports()
    } catch (error) {
      alert('Cập nhật thất bại')
    }
  }

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <Report sx={{ mr: 1 }} />
          Quản lý Sự Cố & Báo Cáo
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tiêu đề</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Người báo cáo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} hover>
                <TableCell>{report.id}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{report.title}</TableCell>
                <TableCell>{getTypeChip(report.report_type)}</TableCell>
                <TableCell>Tenant #{report.tenant_id}</TableCell>
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

      {/* Report Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết báo cáo</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedReport.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Phòng #{selectedReport.room_id} - Người báo cáo: #{selectedReport.tenant_id}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ngày tạo: {new Date(selectedReport.createdAt).toLocaleString('vi-VN')}
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

              <form onSubmit={handleSubmit(handleUpdateStatus)}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue={selectedReport.status}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Cập nhật trạng thái</InputLabel>
                      <Select {...field} label="Cập nhật trạng thái">
                        <MenuItem value="new">Mới</MenuItem>
                        <MenuItem value="in_progress">Đang xử lý</MenuItem>
                        <MenuItem value="resolved">Đã giải quyết</MenuItem>
                        <MenuItem value="closed">Đã đóng</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
                  <Button type="submit" variant="contained">
                    Cập nhật trạng thái
                  </Button>
                </DialogActions>
              </form>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
