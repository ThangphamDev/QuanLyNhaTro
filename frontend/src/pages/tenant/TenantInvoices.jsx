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
  DialogActions
} from '@mui/material'
import {
  Receipt,
  Visibility,
  Payment,
  CalendarToday
} from '@mui/icons-material'
import api from '../../api'

export default function TenantInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    api.get('/tenant/invoices')
      .then(r => setInvoices(r.data))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false))
  }, [])

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'Chưa thanh toán', color: 'warning' },
      paid: { label: 'Đã thanh toán', color: 'success' },
      overdue: { label: 'Quá hạn', color: 'error' },
      cancelled: { label: 'Đã hủy', color: 'default' }
    }
    const config = statusConfig[status] || { label: status, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setDialogOpen(true)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <Receipt sx={{ mr: 1 }} />
        Hóa Đơn & Thanh Toán
      </Typography>

      {loading ? (
        <Typography>Đang tải...</Typography>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Receipt sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có hóa đơn nào
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hóa đơn sẽ được tạo hàng tháng
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📊 Tổng quan
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Paper sx={{ p: 2, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Tổng hóa đơn
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {invoices.length}
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Đã thanh toán
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {invoices.filter(inv => inv.status === 'paid').length}
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa thanh toán
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {invoices.filter(inv => inv.status === 'pending').length}
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Invoice Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hóa đơn</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tháng/Năm</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ngày phát hành</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hạn thanh toán</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tiền phòng</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Điện nước</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tổng tiền</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        #{invoice.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {invoice.billing_month}/{invoice.billing_year}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.issue_date).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        {new Date(invoice.due_date).toLocaleDateString('vi-VN')}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {new Intl.NumberFormat('vi-VN').format(invoice.room_fee || invoice.total_amount)} VND
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                          <>
                            {invoice.invoice_items.filter(item => item.description.includes('Điện:')).map((item, index) => (
                              <Typography key={index} variant="body2" color="text.secondary">
                                ⚡ {new Intl.NumberFormat('vi-VN').format(item.amount)} VND
                              </Typography>
                            ))}
                            {invoice.invoice_items.filter(item => item.description.includes('Nước:')).map((item, index) => (
                              <Typography key={index} variant="body2" color="text.secondary">
                                💧 {new Intl.NumberFormat('vi-VN').format(item.amount)} VND
                              </Typography>
                            ))}
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Không có
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {new Intl.NumberFormat('vi-VN').format(invoice.total_amount)} VND
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(invoice.status)}
                    </TableCell>
                    <TableCell>
                      <Button
                        startIcon={<Visibility />}
                        onClick={() => handleViewInvoice(invoice)}
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
        </>
      )}

      {/* Invoice Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết hóa đơn #{selectedInvoice?.id}</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Tháng {selectedInvoice.billing_month}/{selectedInvoice.billing_year}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ngày phát hành: {new Date(selectedInvoice.issue_date).toLocaleDateString('vi-VN')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hạn thanh toán: {new Date(selectedInvoice.due_date).toLocaleDateString('vi-VN')}
                </Typography>
                {getStatusChip(selectedInvoice.status)}
              </Box>

              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Chi tiết thanh toán
                </Typography>
                
                {/* Chi tiết từ invoice_items */}
                {selectedInvoice.invoice_items && selectedInvoice.invoice_items.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Khoản thu</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Số tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedInvoice.invoice_items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {item.description.includes('Điện:') && '⚡ '}
                            {item.description.includes('Nước:') && '💧 '}
                            {item.description.includes('Tiền thuê phòng') && '🏠 '}
                            {item.description}
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              {new Intl.NumberFormat('vi-VN').format(item.amount)} VND
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box>
                    <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <span>Tiền thuê phòng:</span>
                      <span>{new Intl.NumberFormat('vi-VN').format(selectedInvoice.total_amount)} VND</span>
                    </Typography>
                  </Box>
                )}

                {/* Tổng cộng */}
                <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Tổng cộng:</span>
                    <span style={{ color: '#1976d2' }}>
                      {new Intl.NumberFormat('vi-VN').format(selectedInvoice.total_amount)} VND
                    </span>
                  </Typography>
                </Box>
              </Paper>

              {selectedInvoice.status === 'pending' && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="warning.dark">
                    <strong>Lưu ý:</strong> Vui lòng thanh toán trước hạn để tránh phát sinh phí trễ hạn.
                    Liên hệ quản trị để biết thêm thông tin về phương thức thanh toán.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
          {selectedInvoice?.status === 'pending' && (
            <Button variant="contained" startIcon={<Payment />}>
              Thanh toán
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
