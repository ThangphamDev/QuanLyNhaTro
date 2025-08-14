import React from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Backdrop,
  Grid,
  Divider
} from '@mui/material'
import { 
  Home, 
  Business, 
  Login, 
  Dashboard,
  AccountCircle,
  Menu as MenuIcon,
  LogoutOutlined,
  AdminPanelSettingsOutlined,
  PersonOutlined
} from '@mui/icons-material'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function getToken() { return localStorage.getItem('token') }
function getUser() {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null)
  
  // Use full width for all pages
  const isFullWidth = true

  const token = getToken()
  const user = getUser()

  const handleLogout = () => {
    localStorage.clear()
    setAnchorEl(null)
    navigate('/')
  }

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: <Home sx={{ fontSize: 20 }} /> },
    { label: 'Xem phòng', path: '/rooms', icon: <Business sx={{ fontSize: 20 }} /> }
  ]

  // Improved user menu items with proper icons
  const userMenuItems = token ? [
    user?.role === 'admin' && { 
      label: 'Quản trị', 
      path: '/admin', 
      icon: <AdminPanelSettingsOutlined sx={{ fontSize: 18 }} /> 
    },
    user?.role === 'tenant' && { 
      label: 'Cá nhân', 
      path: '/tenant', 
      icon: <PersonOutlined sx={{ fontSize: 18 }} /> 
    }
  ].filter(Boolean) : []

  // Check if current path is active for navigation highlighting
  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const isHome = location.pathname === '/'

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'grey.50' // Consistent background với home page
    }}>
      {/* Modern Glass Morphism AppBar - Increased Height */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(120deg, rgba(5,30,60,0.97) 0%, rgba(10,52,110,0.95) 55%, rgba(15,76,150,0.93) 100%)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          minHeight: { xs: 58, sm: 64, md: 70 },
          boxShadow: '0 8px 22px -6px rgba(5,30,60,0.55)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 60%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Toolbar sx={{ 
          px: { xs: 1.5, sm: 2.5, md: 3 },
          minHeight: { xs: 58, sm: 64, md: 70 },
          py: { xs: 0.25, sm: 0.5, md: 0.5 }
        }}>
          {/* Brand Logo với improved styling */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 700, // Bold cho brand strength
              fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.3rem' },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 }, // Responsive gap
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)',
                transform: 'scale(1.02)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                bgcolor: 'rgba(255,255,255,0.18)',
                borderRadius: 2, // Rounded corners thay vì emoji
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.25)'
              }}
            >
              <Home sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, color: 'white' }} />
            </Box>
            Smart Rental
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    px: { sm: 2.2, md: 3 },
                    py: { sm: 0.9, md: 1 },
                    borderRadius: 2, // Soft corners
                    textTransform: 'none',
                    fontSize: { sm: '0.95rem', md: '1rem' }, // Slightly larger text
                    // Active state styling
                    bgcolor: isActivePath(item.path) ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                    border: isActivePath(item.path) ? '1px solid rgba(255,255,255,0.30)' : '1px solid rgba(255,255,255,0.12)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.24)',
                      border: '1px solid rgba(255,255,255,0.38)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 22px -4px rgba(5,30,60,0.55)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* User Menu Section */}
          {token ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* User greeting - hidden on mobile for space */}
              <Typography 
                variant="body2" 
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 500,
                  fontSize: { sm: '0.875rem', md: '0.95rem' } // Slightly larger text
                }}
              >
                Xin chào, {user?.full_name}
              </Typography>
              
              {/* User Avatar Button với glass effect */}
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.20)',
                  border: '1px solid rgba(255,255,255,0.32)',
                  backdropFilter: 'blur(10px)',
                  width: { xs: 36, sm: 40, md: 44 },
                  height: { xs: 36, sm: 40, md: 44 },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.28)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 26px -6px rgba(5,30,60,0.55)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <AccountCircle sx={{ color: 'white', fontSize: { xs: 22, sm: 24, md: 24 } }} />
              </IconButton>

              {/* Enhanced User Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                TransitionComponent={Fade}
                sx={{
                  '& .MuiPaper-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3, // Soft corners
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    minWidth: 200,
                    mt: 1
                  }
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {/* User info header in dropdown */}
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'black' }}>
                    {user?.full_name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'grey.600' }}>
                    {user?.role === 'admin' ? 'Quản trị viên' : 'Khách thuê'}
                  </Typography>
                </Box>

                {/* Menu items */}
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={() => setAnchorEl(null)}
                    sx={{
                      py: 1.5,
                      px: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        '& .MuiSvgIcon-root': {
                          transform: 'scale(1.1)'
                        }
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {item.icon}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                  </MenuItem>
                ))}
                
                {/* Logout item với special styling */}
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 3,
                    mt: 1,
                    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'rgba(211, 47, 47, 0.04)',
                      '& .MuiSvgIcon-root': {
                        transform: 'scale(1.1)'
                      }
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LogoutOutlined sx={{ fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Đăng xuất
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            // Login Button cho users chưa đăng nhập
      <Button
              component={Link}
              to="/login"
              startIcon={<Login />}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.17)',
                border: '1px solid rgba(255,255,255,0.28)',
                borderRadius: 2,
                px: { xs: 2, sm: 2.4, md: 3 },
                py: { xs: 0.8, sm: 1, md: 1.1 },
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.26)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 26px -6px rgba(5,30,60,0.55)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Đăng nhập
            </Button>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
              sx={{
                ml: 1,
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                width: { xs: 42, sm: 46 }, // Increased size for mobile
                height: { xs: 42, sm: 46 },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.25)'
                }
              }}
            >
              <MenuIcon sx={{ color: 'white', fontSize: { xs: 22, sm: 24 } }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Enhanced Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={() => setMobileMenuAnchor(null)}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            minWidth: 200,
            mt: 1
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {navItems.map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => setMobileMenuAnchor(null)}
            sx={{
              py: 1.5,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              // Active state cho mobile
              bgcolor: isActivePath(item.path) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.06)',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1)'
                }
              },
              transition: 'all 0.2s ease'
            }}
          >
            {item.icon}
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {item.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Main Content Area with Added Margin */}
      {isFullWidth ? (
        <Box sx={{ 
          flex: 1, 
          py: 0,
          mt: isHome ? 0 : { xs: 2, sm: 3, md: 4 }
        }}> 
          {children}
        </Box>
      ) : (
        <Container maxWidth="xl" sx={{ 
          flex: 1, 
          py: 3,
          mt: isHome ? 0 : { xs: 2, sm: 3, md: 4 }
        }}>
          {children}
        </Container>
      )}

      {/* Modern Footer với glass effect */}
      <Box 
        component="footer" 
        sx={{ 
          background: 'linear-gradient(180deg, #061a32 0%, #092c55 55%, #0d3d7a 100%)',
          borderTop: '2px solid rgba(255,255,255,0.12)',
          mt: 'auto',
          position: 'relative',
          color: 'rgba(255,255,255,0.85)',
          pt: { xs: 6, md: 8 },
          pb: { xs: 4, md: 6 },
          px: { xs: 2, sm: 4, md: 6 },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, letterSpacing: '.5px' }}>
                Smart Rental
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, opacity: 0.9 }}>
                Nền tảng giúp chủ trọ và khách thuê quản lý phòng, hợp đồng, hóa đơn và báo cáo một cách minh bạch, nhanh chóng và hiệu quả.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, opacity: 0.95, letterSpacing: '.5px' }}>Tính năng</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.8 }}>Quản lý phòng</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.8 }}>Hợp đồng & hóa đơn</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.8 }}>Quản lý tài sản</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.8 }}>Báo cáo & thống kê</Typography>
            </Grid>
            <Grid item xs={6} md={2.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, opacity: 0.95, letterSpacing: '.5px' }}>Hỗ trợ</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.8 }}>Trung tâm trợ giúp</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.8 }}>Hướng dẫn sử dụng</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.8 }}>Câu hỏi thường gặp</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.8 }}>Chính sách bảo mật</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, opacity: 0.95, letterSpacing: '.5px' }}>Liên hệ</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.85 }}>Email: support@smartrental.vn</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.85 }}>Hotline: 0123 456 789</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.75, opacity: 0.85 }}>Địa chỉ: TP. Hồ Chí Minh</Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Box sx={{ width: 34, height: 34, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1.5 }} />
                <Box sx={{ width: 34, height: 34, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1.5 }} />
                <Box sx={{ width: 34, height: 34, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1.5 }} />
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 400, letterSpacing: '.5px', opacity: 0.85 }}>
              © 2025 Smart Rental Management System. All rights reserved.
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.6 }}>
              Hệ thống quản lý nhà trọ thông minh giúp tối ưu vận hành & trải nghiệm người dùng.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}