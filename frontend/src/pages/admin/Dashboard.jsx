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
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Business,
  Home as RoomIcon,
  Inventory,
  People,
  Receipt,
  AttachMoney,
  Report,
  TrendingUp,
  TrendingDown,
  Person,
  Assignment,
  Category
} from '@mui/icons-material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../../api'

// Import components we'll create
import PropertyManagement from './PropertyManagement.jsx'
import RoomManagement from './RoomManagement.jsx'
import TenantManagement from './TenantManagement.jsx'
import AssetManagement from './AssetManagement.jsx'
import AssetTypeManagement from './AssetTypeManagement.jsx'
import ContractManagement from './ContractManagement.jsx'
import FinanceManagement from './FinanceManagement.jsx'
import ReportManagement from './ReportManagement.jsx'

function AdminDashboardOverview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setData(r.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false))
  }, [])

  const chartData = [
    { name: 'Tháng 1', revenue: 15000000 },
    { name: 'Tháng 2', revenue: 18000000 },
    { name: 'Tháng 3', revenue: 16500000 },
    { name: 'Tháng 4', revenue: 22000000 },
    { name: 'Tháng 5', revenue: 19500000 },
    { name: 'Tháng 6', revenue: data?.revenue_month || 25000000 },
  ]

  if (loading) return <Typography>Đang tải...</Typography>

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        📊 Tổng quan hệ thống
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Doanh thu tháng
                  </Typography>
                  <Typography variant="h4">
                    {new Intl.NumberFormat('vi-VN').format(data?.revenue_month || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    +12% so với tháng trước
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RoomIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Phòng trống
                  </Typography>
                  <Typography variant="h4">
                    {data?.rooms_available || 0}
                  </Typography>
                  <Typography variant="body2">
                    Sẵn sàng cho thuê
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Phòng đang thuê
                  </Typography>
                  <Typography variant="h4">
                    {data?.rooms_occupied || 0}
                  </Typography>
                  <Typography variant="body2">
                    Đang có người ở
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #F44336 30%, #E91E63 90%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Report sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Báo cáo mới
                  </Typography>
                  <Typography variant="h4">
                    {data?.reports_new || 0}
                  </Typography>
                  <Typography variant="body2">
                    Cần xử lý
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          📈 Biểu đồ doanh thu 6 tháng gần đây
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [new Intl.NumberFormat('vi-VN').format(value) + ' VND', 'Doanh thu']} />
            <Legend />
            <Bar dataKey="revenue" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🎯 Thao tác nhanh
            </Typography>
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Thêm người thuê mới" secondary="Tạo tài khoản cho khách thuê" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText primary="Tạo hóa đơn tháng" secondary="Phát sinh hóa đơn cho tất cả phòng" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <RoomIcon />
                  </ListItemIcon>
                  <ListItemText primary="Thêm phòng mới" secondary="Đăng ký phòng trọ mới" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🔔 Thông báo gần đây
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <AttachMoney />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary="Thanh toán từ phòng A101" 
                  secondary="2 giờ trước - 3.500.000 VND"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Report />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary="Báo cáo sự cố từ phòng B203" 
                  secondary="5 giờ trước - Điều hòa không hoạt động"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <Person />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary="Người thuê mới đăng ký" 
                  secondary="Hôm qua - Nguyễn Văn A"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const menuItems = [
    { key: 'dashboard', label: 'Tổng quan', icon: <DashboardIcon />, path: '' },
    { key: 'properties', label: 'Quản lý khu trọ', icon: <Business />, path: 'properties' },
    { key: 'rooms', label: 'Quản lý phòng', icon: <RoomIcon />, path: 'rooms' },
    { key: 'tenants', label: 'Quản lý người thuê', icon: <People />, path: 'tenants' },
    { key: 'contracts', label: 'Quản lý hợp đồng', icon: <Assignment />, path: 'contracts' },
    { key: 'assets', label: 'Quản lý tài sản', icon: <Inventory />, path: 'assets' },
    { key: 'asset-types', label: 'Quản lý loại tài sản', icon: <Category />, path: 'asset-types' },
    { key: 'finance', label: 'Quản lý tài chính', icon: <AttachMoney />, path: 'finance' },
    { key: 'reports', label: 'Quản lý sự cố', icon: <Report />, path: 'reports' },
  ]

  return (
    <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 3, minHeight: '80vh' }}>
          {/* Sidebar */}
          <Paper 
            sx={{ 
              width: isMobile ? '100%' : 280, 
              mb: isMobile ? 2 : 0,
              flexShrink: 0,
              position: isMobile ? 'static' : 'sticky',
              top: 20,
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto'
            }}
          >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🏢 Bảng điều khiển Admin
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
                  navigate(`/admin/${item.path}`)
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
          <Route path="/" element={<AdminDashboardOverview />} />
          <Route path="/properties" element={<PropertyManagement />} />
          <Route path="/rooms" element={<RoomManagement />} />
          <Route path="/tenants" element={<TenantManagement />} />
          <Route path="/contracts" element={<ContractManagement />} />
          <Route path="/assets" element={<AssetManagement />} />
          <Route path="/asset-types" element={<AssetTypeManagement />} />
          <Route path="/finance" element={<FinanceManagement />} />
          <Route path="/reports" element={<ReportManagement />} />
        </Routes>
      </Box>
        </Box>
      </Box>
    </Box>
  )
}


