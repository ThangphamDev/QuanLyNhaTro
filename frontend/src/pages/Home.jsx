import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Container,
  Chip,
  Skeleton,
  Divider
} from '@mui/material'
import {
  LocationOn,
  Home as HomeIcon,
  Straighten,
  AttachMoney,
  ArrowForward,
  Star
} from '@mui/icons-material'
import api from '../api'

export default function Home() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/public/featured')
      .then(r => setRooms(r.data))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box 
      sx={{ 
        width: '100%',
        bgcolor: 'grey.50', // Nền sáng tổng thể để tạo sự tương phản
        minHeight: '100vh'
      }}
    >
      {/* Modern Hero Section with Background Image */}
      <Box
        sx={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")', // Hình ảnh phòng trọ hiện đại
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Parallax effect nhẹ
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: 8,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 2, md: 3 }, // Thêm border radius mềm mại
          mx: { xs: 2, sm: 3, md: 4 }, // Margin để tạo breathing room
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)', // Overlay gradient mềm mại hơn
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            {/* Soft Icon with Glass Effect */}
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 80,
                height: 80,
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: 6, // BorderRadius mềm mại thay vì tròn hoàn toàn
                mb: 4,
                backdropFilter: 'blur(10px)', // Glass morphism effect
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  transform: 'scale(1.05) rotate(2deg)', // Thêm rotation nhẹ cho cảm giác playful
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }
              }}
            >
              <HomeIcon sx={{ fontSize: 40 }} />
            </Box>

            {/* Modern Typography */}
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 300, // Lighter weight cho look hiện đại
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                letterSpacing: '-0.02em',
                mb: 2
              }}
            >
              Tìm Phòng Trọ
            </Typography>
            
            <Typography 
              variant="h1" 
              component="span" 
              sx={{ 
                fontWeight: 700, // Bold cho từ nhấn mạnh
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                letterSpacing: '-0.02em',
                display: 'block',
                mb: 4
              }}
            >
              Lý Tưởng
            </Typography>

            <Typography 
              variant="h6" 
              sx={{ 
                mb: 6, 
                opacity: 0.8,
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 300,
                lineHeight: 1.6
              }}
            >
              Hệ thống quản lý nhà trọ hiện đại với giao diện thân thiện, 
              đảm bảo an toàn và minh bạch trong mọi giao dịch
            </Typography>

            {/* Soft CTA Button với breathing space */}
            <Button
              component={Link}
              to="/rooms"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.95)', // Slightly transparent cho soft feel
                color: 'black',
                px: 6,
                py: 2.5,
                borderRadius: 3, // Mềm mại hơn từ sharp corners
                fontWeight: 600,
                fontSize: '1.1rem',
                textTransform: 'none',
                backdropFilter: 'blur(10px)', // Glass effect tinh tế
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // Shadow mềm mại
                '&:hover': { 
                  bgcolor: 'white',
                  transform: 'translateY(-3px)', // Giảm từ -2px xuống -3px cho smooth hơn
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)' // Shadow đậm hơn khi hover
                },
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Easing function mềm mại hơn
              }}
            >
              Khám Phá Ngay
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Rooms Section */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Section Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Star sx={{ fontSize: 28, color: 'black', mr: 1 }} />
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                color: 'black',
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}
            >
              Phòng Nổi Bật
            </Typography>
          </Box>
          
          <Divider 
            sx={{ 
              width: 80, 
              height: 3, 
              bgcolor: 'black', 
              mx: 'auto',
              borderRadius: 3 // Thêm border radius cho soft feel
            }} 
          />
        </Box>

        {loading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} lg={4} key={item}>
                <Card sx={{ borderRadius: 3, boxShadow: 'none', overflow: 'hidden' }}> {/* Thêm border radius cho loading cards */}
                  <Skeleton variant="rectangular" width="100%" height={280} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="text" height={24} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={4}>
            {rooms.map((room) => (
              <Grid item xs={12} sm={6} lg={4} key={room.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3, // Thay từ 0 sang 3 cho soft corners
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)', // Shadow mềm hơn
                    border: '1px solid rgba(0,0,0,0.08)', // Border opacity thấp hơn cho soft feel
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Easing mềm mại hơn
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.01)', // Scale nhẹ thêm dimension
                      boxShadow: '0 20px 40px rgba(0,0,0,0.08)', // Shadow spread rộng hơn nhưng opacity thấp
                      borderColor: 'rgba(0,0,0,0.12)',
                      '& .room-image': {
                        transform: 'scale(1.03)' // Giảm scale để không quá aggressive
                      }
                    }
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 280,
                      position: 'relative',
                      overflow: 'hidden',
                      bgcolor: '#f8f9fa'
                    }}
                  >
                    {room.room_images && room.room_images.length > 0 ? (
                      <img
                        src={`http://localhost:4000${room.room_images[0].image_url}`}
                        alt="Room"
                        className="room-image"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      />
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        bgcolor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <HomeIcon sx={{ fontSize: 80, color: '#dee2e6' }} />
                      </Box>
                    )}
                    
                    {/* Status Chip với style mềm mại */}
                    <Chip
                      label="Còn Trống"
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16,
                        bgcolor: 'rgba(0,0,0,0.8)', // Không đen thuần túy, có transparency
                        color: 'white',
                        borderRadius: 2, // Thêm border radius thay vì 0
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)', // Glass morphism effect
                        border: '1px solid rgba(255,255,255,0.1)', // Subtle border
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.9)',
                          transform: 'scale(1.05)', // Gentle scale effect
                          transition: 'all 0.2s ease'
                        }
                      }}
                    />
                  </CardMedia>
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'black',
                        mb: 2
                      }}
                    >
                      Phòng {room.room_number}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <LocationOn sx={{ fontSize: 18, mr: 1, color: 'grey.600' }} />
                        <Typography variant="body1" sx={{ color: 'grey.700', fontWeight: 500 }}>
                          {room.property?.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <AttachMoney sx={{ fontSize: 18, mr: 1, color: 'grey.600' }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            color: 'black'
                          }}
                        >
                          {new Intl.NumberFormat('vi-VN').format(room.rent_price)} VND
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'grey.500', ml: 1 }}>
                          /tháng
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Straighten sx={{ fontSize: 18, mr: 1, color: 'grey.600' }} />
                        <Typography variant="body1" sx={{ color: 'grey.700' }}>
                          {room.area} m²
                        </Typography>
                      </Box>
                    </Box>

                    {room.description && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'grey.600',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {room.description}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      component={Link}
                      to={`/rooms/${room.id}`}
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.9)', // Không đen thuần túy, có một chút transparency
                        color: 'white',
                        borderRadius: 2, // Thêm border radius thay vì 0
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          bgcolor: 'black',
                          transform: 'translateY(-1px)', // Giữ nguyên gentle lift
                          boxShadow: '0 6px 20px rgba(0,0,0,0.15)' // Thêm shadow khi hover
                        },
                        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Easing mềm mại
                      }}
                    >
                      Xem Chi Tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && rooms.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <HomeIcon sx={{ fontSize: 80, color: 'grey.300', mb: 3 }} />
            <Typography variant="h5" sx={{ color: 'grey.600', mb: 2, fontWeight: 300 }}>
              Hiện tại chưa có phòng nổi bật
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.500', mb: 4, maxWidth: '400px', mx: 'auto' }}>
              Chúng tôi đang cập nhật thêm nhiều phòng trọ chất lượng. 
              Hãy xem tất cả phòng hiện có hoặc quay lại sau.
            </Typography>
            <Button
              component={Link}
              to="/rooms"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'black',
                color: 'black',
                borderRadius: 0,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'black',
                  bgcolor: 'black',
                  color: 'white'
                }
              }}
            >
              Xem Tất Cả Phòng
            </Button>
          </Box>
        )}
      </Container>

      {/* Bottom spacing */}
      <Box sx={{ pb: 8 }} />
    </Box>
  )
}