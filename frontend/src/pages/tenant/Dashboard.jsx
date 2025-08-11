import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Button,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Home as RoomIcon,
  Receipt,
  Report,
  Person,
  AttachMoney,
  LocationOn,
  Phone,
  Email,
  CalendarToday,
  Assignment
} from '@mui/icons-material'
import api from '../../api'

// Import components we'll create
import TenantContracts from './TenantContracts.jsx'
import TenantInvoices from './TenantInvoices.jsx'
import TenantReports from './TenantReports.jsx'
import TenantProfile from './TenantProfile.jsx'

function TenantDashboardOverview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tenant/dashboard')
      .then(r => setData(r.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Typography>Đang tải...</Typography>

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        👋 Chào mừng bạn quay trở lại!
      </Typography>

      <Grid container spacing={3}>
        {/* Current Room Info */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <RoomIcon sx={{ mr: 1 }} />
                Thông tin phòng hiện tại
              </Typography>
              
              {data?.contract ? (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Khu trọ
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {data.contract.room?.property?.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <RoomIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Số phòng
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {data.contract.room?.room_number}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Giá thuê
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {new Intl.NumberFormat('vi-VN').format(data.contract.rent_price)} VND/tháng
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Ngày bắt đầu
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {new Date(data.contract.start_date).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Chip 
                    label={data.contract.status === 'active' ? 'Hợp đồng đang hiệu lực' : 'Hợp đồng hết hiệu lực'} 
                    color={data.contract.status === 'active' ? 'success' : 'default'}
                    sx={{ mt: 2 }}
                  />
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <RoomIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Chưa có hợp đồng thuê phòng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vui lòng liên hệ với quản trị để được hỗ trợ
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Latest Invoice */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <Receipt sx={{ mr: 1 }} />
                Hóa đơn gần nhất
              </Typography>
              
              {data?.latestInvoice ? (
                <Box>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tổng tiền
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {new Intl.NumberFormat('vi-VN').format(data.latestInvoice.total_amount)} VND
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Hạn thanh toán
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {new Date(data.latestInvoice.due_date).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={
                        data.latestInvoice.status === 'paid' ? 'Đã thanh toán' :
                        data.latestInvoice.status === 'pending' ? 'Chưa thanh toán' :
                        data.latestInvoice.status === 'overdue' ? 'Quá hạn' : 'Đã hủy'
                      }
                      color={
                        data.latestInvoice.status === 'paid' ? 'success' :
                        data.latestInvoice.status === 'pending' ? 'warning' :
                        data.latestInvoice.status === 'overdue' ? 'error' : 'default'
                      }
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có hóa đơn nào
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Contact */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🎯 Thao tác nhanh
              </Typography>
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Report />
                    </ListItemIcon>
                    <ListItemText primary="Báo cáo sự cố" secondary="Thông báo vấn đề phòng trọ" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Receipt />
                    </ListItemIcon>
                    <ListItemText primary="Xem hóa đơn" secondary="Lịch sử thanh toán" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="Cập nhật hồ sơ" secondary="Thông tin cá nhân" />
                  </ListItemButton>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                📞 Thông tin liên hệ
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Quản trị hệ thống
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    0123 456 789
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    admin@example.com
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  startIcon={<Phone />}
                  sx={{ mb: 1 }}
                >
                  Gọi điện
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  startIcon={<Email />}
                >
                  Gửi email
                </Button>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                <Typography variant="body2" color="info.main">
                  <strong>Giờ hỗ trợ:</strong> 8:00 - 22:00 hàng ngày
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default function TenantDashboard() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const menuItems = [
    { key: 'dashboard', label: 'Tổng quan', icon: <DashboardIcon />, path: '' },
    { key: 'contracts', label: 'Hợp đồng', icon: <Assignment />, path: 'contracts' },
    { key: 'invoices', label: 'Hóa đơn', icon: <Receipt />, path: 'invoices' },
    { key: 'reports', label: 'Báo cáo sự cố', icon: <Report />, path: 'reports' },
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: <Person />, path: 'profile' },
  ]

  return (
    <Box sx={{ display: 'flex', minHeight: '80vh' }}>
      {/* Sidebar */}
      <Paper 
        sx={{ 
          width: isMobile ? '100%' : 280, 
          mr: isMobile ? 0 : 3, 
          mb: isMobile ? 2 : 0,
          flexShrink: 0 
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            👤 Cổng thông tin cá nhân
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                selected={activeMenu === item.key}
                onClick={() => {
                  setActiveMenu(item.key)
                  navigate(`/tenant/${item.path}`)
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<TenantDashboardOverview />} />
          <Route path="/contracts" element={<TenantContracts />} />
          <Route path="/invoices" element={<TenantInvoices />} />
          <Route path="/reports" element={<TenantReports />} />
          <Route path="/profile" element={<TenantProfile />} />
        </Routes>
      </Box>
    </Box>
  )
}


