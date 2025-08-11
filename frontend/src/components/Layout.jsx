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
  Backdrop
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
        elevation={0} // Remove default elevation cho clean look
        sx={{ 
          background: 'rgba(0, 0, 0, 0.9)', // Semi-transparent black thay vì solid color
          backdropFilter: 'blur(20px)', // Strong blur effect cho glass morphism
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
          // Increased minimum height for the AppBar
          minHeight: { xs: 80, sm: 90, md: 100 }, // Increased from default ~64px
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Toolbar sx={{ 
          px: { xs: 2, sm: 3, md: 4 },
          // Increased toolbar height to match AppBar
          minHeight: { xs: 80, sm: 90, md: 100 }, // Match the AppBar height
          py: { xs: 1, sm: 1.5, md: 2 } // Add vertical padding for better spacing
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
              fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem' }, // Increased font sizes
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
                width: { xs: 36, sm: 40, md: 44 }, // Increased icon container size
                height: { xs: 36, sm: 40, md: 44 },
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 2, // Rounded corners thay vì emoji
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Home sx={{ fontSize: { xs: 20, sm: 22, md: 24 }, color: 'white' }} />
            </Box>
            Smart Rental
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    px: { sm: 3, md: 4 }, // Increased horizontal padding
                    py: { sm: 1.2, md: 1.5 }, // Increased vertical padding
                    borderRadius: 2, // Soft corners
                    textTransform: 'none',
                    fontSize: { sm: '0.95rem', md: '1rem' }, // Slightly larger text
                    // Active state styling
                    bgcolor: isActivePath(item.path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    border: isActivePath(item.path) ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
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
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  width: { xs: 42, sm: 46, md: 50 }, // Increased button size
                  height: { xs: 42, sm: 46, md: 50 },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <AccountCircle sx={{ color: 'white', fontSize: { xs: 24, sm: 26, md: 28 } }} />
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
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                px: { xs: 2.5, sm: 3, md: 4 }, // Increased padding
                py: { xs: 1, sm: 1.2, md: 1.5 }, // Increased padding
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' }, // Responsive font size
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)'
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
          // Add top margin to create space between header and banner
          mt: { xs: 2, sm: 3, md: 4 } // Responsive margin top
        }}> 
          {children}
        </Box>
      ) : (
        <Container maxWidth="xl" sx={{ 
          flex: 1, 
          py: 3,
          // Add top margin for container layout as well
          mt: { xs: 2, sm: 3, md: 4 }
        }}>
          {children}
        </Container>
      )}

      {/* Modern Footer với glass effect */}
      <Box 
        component="footer" 
        sx={{ 
          background: 'rgba(0, 0, 0, 0.9)', // Match với AppBar
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          py: 3,
          px: { xs: 2, sm: 3, md: 4 },
          mt: 'auto',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 400,
                letterSpacing: '0.5px'
              }}
            >
              © 2025 Smart Rental Management System
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                display: 'block',
                mt: 0.5
              }}
            >
              Hệ thống quản lý nhà trọ hiện đại & thông minh
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}