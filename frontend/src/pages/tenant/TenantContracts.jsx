import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Assignment,
  CalendarToday,
  AttachMoney,
  LocationOn,
  Home as RoomIcon,
  CheckCircle
} from '@mui/icons-material'
import api from '../../api'

export default function TenantContracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)

  useEffect(() => {
    api.get('/tenant/contracts')
      .then(r => setContracts(r.data))
      .catch(() => setContracts([]))
      .finally(() => setLoading(false))
  }, [])

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { label: 'Đang hiệu lực', color: 'success' },
      expired: { label: 'Hết hạn', color: 'error' },
      terminated: { label: 'Đã chấm dứt', color: 'default' }
    }
    const config = statusConfig[status] || { label: status, color: 'default' }
    return <Chip label={config.label} color={config.color} />
  }

  const handleSign = async (id) => {
    try {
      setSigning(true)
      setError('')
      setSuccess('')
      await api.post(`/tenant/contracts/${id}/sign`)
      setSuccess('Ký hợp đồng thành công')
      const r = await api.get('/tenant/contracts')
      setContracts(r.data)
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError(e.response?.data?.message || 'Ký hợp đồng thất bại')
    } finally {
      setSigning(false)
    }
  }

  const openDetail = async (id) => {
    try {
      setError('')
      setDetailLoading(true)
      const r = await api.get(`/tenant/contracts/${id}`)
      setSelectedContract(r.data)
      setDetailOpen(true)
    } catch (e) {
      setError(e.response?.data?.message || 'Không tải được chi tiết hợp đồng')
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <Assignment sx={{ mr: 1 }} />
        Hợp Đồng Thuê Phòng
      </Typography>

  {loading ? (
        <Typography>Đang tải...</Typography>
  ) : contracts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Assignment sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có hợp đồng nào
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng liên hệ với quản trị để được hỗ trợ
            </Typography>
          </CardContent>
        </Card>
  ) : (
        <Grid container spacing={3}>
          {contracts.map((contract) => (
            <Grid item xs={12} key={contract.id}>
              <Card>
                <CardContent>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
      {success && <Typography color="success.main" sx={{ mb: 1 }}>{success}</Typography>}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Hợp đồng #{contract.id}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {getStatusChip(contract.status)}
                      <Button size="small" variant="contained" onClick={() => openDetail(contract.id)}>
                        Xem chi tiết
                      </Button>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Thông tin phòng
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {contract.room?.property?.name}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <RoomIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            Phòng {contract.room?.room_number}
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          Diện tích: {contract.room?.area} m² | Tối đa: {contract.room?.max_tenants} người
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Thông tin hợp đồng
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            Từ {new Date(contract.start_date).toLocaleDateString('vi-VN')}
                            {contract.end_date && ` đến ${new Date(contract.end_date).toLocaleDateString('vi-VN')}`}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AttachMoney sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {new Intl.NumberFormat('vi-VN').format(contract.rent_price)} VND/tháng
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          Tiền cọc: {new Intl.NumberFormat('vi-VN').format(contract.deposit_amount)} VND
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {contract.room?.description && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Mô tả phòng:</strong> {contract.room.description}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Trạng thái ký: {contract.is_signed ? 'Đã ký' : 'Chưa ký'} {contract.signed_at ? `(${new Date(contract.signed_at).toLocaleString('vi-VN')})` : ''}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Contract Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết hợp đồng</DialogTitle>
        <DialogContent dividers>
          {detailLoading ? (
            <Typography>Đang tải...</Typography>
          ) : !selectedContract ? (
            <Typography color="text.secondary">Không có dữ liệu</Typography>
          ) : (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Thông tin chung</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="body2">Mã HĐ: <strong>#{selectedContract.id}</strong></Typography>
                  <Typography variant="body2">Trạng thái: <strong>{selectedContract.status}</strong></Typography>
                  <Typography variant="body2">Trạng thái ký: <strong>{selectedContract.is_signed ? 'Đã ký' : 'Chưa ký'}</strong></Typography>
                  {selectedContract.signed_at && (
                    <Typography variant="body2">Ký lúc: {new Date(selectedContract.signed_at).toLocaleString('vi-VN')}</Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="body2">Tiền thuê: <strong>{new Intl.NumberFormat('vi-VN').format(selectedContract.rent_price)} VND</strong></Typography>
                  <Typography variant="body2">Tiền cọc: <strong>{new Intl.NumberFormat('vi-VN').format(selectedContract.deposit_amount)} VND</strong></Typography>
                  <Typography variant="body2">Thời hạn: <strong>{new Date(selectedContract.start_date).toLocaleDateString('vi-VN')}{selectedContract.end_date ? ` - ${new Date(selectedContract.end_date).toLocaleDateString('vi-VN')}` : ''}</strong></Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Phòng & Khu trọ</Typography>
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
                <Typography variant="body2">Khu trọ: <strong>{selectedContract.room?.property?.name || 'N/A'}</strong></Typography>
                <Typography variant="body2">Phòng: <strong>{selectedContract.room?.room_number || 'N/A'}</strong></Typography>
                <Typography variant="body2" color="text.secondary">Diện tích: {selectedContract.room?.area} m² | Tối đa: {selectedContract.room?.max_tenants} người</Typography>
                {selectedContract.room?.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Mô tả: {selectedContract.room.description}</Typography>
                )}
              </Box>

              {selectedContract.contract_url && (
                <Box sx={{ mt: 2 }}>
                  <Button href={selectedContract.contract_url} target="_blank" rel="noopener" variant="outlined">
                    Xem file hợp đồng
                  </Button>
                </Box>
              )}
              {selectedContract.content && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Nội dung hợp đồng</Typography>
                  <Typography variant="body2" whiteSpace="pre-line">{selectedContract.content}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Đóng</Button>
          {!!selectedContract && !selectedContract.is_signed && selectedContract.status === 'active' && (
            <Button onClick={() => handleSign(selectedContract.id)} variant="contained" color="success" disabled={signing}>
              {signing ? 'Đang ký...' : 'Ký hợp đồng'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
