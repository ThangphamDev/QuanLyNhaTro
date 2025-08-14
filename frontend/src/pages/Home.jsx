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
        bgcolor: 'linear-gradient(180deg, #e3f2fd 0%, #f5faff 60%)',
        minHeight: '100vh'
      }}
    >
      {/* Modern Hero Section with Background Image */}
      <Box
        sx={{
          mt: '5px',
          backgroundImage: 'url("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          py: { xs: 8, md: 10 },
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 0,
          mx: 0,
          boxShadow: '0 16px 48px -12px rgba(0,0,0,0.35)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.6) 100%)',
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
              <HomeIcon sx={{ fontSize: 40, color: '#fff' }} />
            </Box>

            {/* Modern Typography */}
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.4rem', md: '3.4rem' },
                letterSpacing: '-0.02em',
                mb: 1,
                background: 'linear-gradient(90deg,#bbdefb 0%,#e3f2fd 40%,#fff 70%)',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Tìm Phòng Trọ Lý Tưởng
            </Typography>

            <Typography 
              variant="h6" 
              sx={{ 
                mb: 6, 
                opacity: 0.92,
                maxWidth: '640px',
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Hệ thống quản lý nhà trọ hiện đại với giao diện thân thiện – minh bạch, an toàn và tối ưu trải nghiệm dành cho chủ trọ & người thuê.
            </Typography>

            {/* Soft CTA Button với breathing space */}
            <Button
              component={Link}
              to="/rooms"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(45deg,#1976d2 0%, #2196f3 40%, #42a5f5 100%)',
                color: 'white',
                px: 6,
                py: 2.2,
                borderRadius: 4,
                fontWeight: 700,
                fontSize: '1.05rem',
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(25,118,210,0.45)',
                '&:hover': { 
                  background: 'linear-gradient(45deg,#1565c0 0%, #1976d2 50%, #2196f3 100%)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 14px 40px rgba(25,118,210,0.55)'
                },
                transition: 'all 0.35s ease'
              }}
            >
              Khám Phá Ngay
            </Button>
          </Box>
        </Container>
      </Box>

             {/* Featured Rooms Section */}
       <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         {/* Section Header */}
         <Box sx={{ mb: 6, textAlign: 'center', width: '100%' }}>
           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
             <Star sx={{ fontSize: 30, color: 'primary.main', mr: 1 }} />
             <Typography 
               variant="h3" 
               component="h2" 
               sx={{ 
                 fontWeight: 800, 
                 background: 'linear-gradient(90deg,#1976d2,#42a5f5)',
                 WebkitBackgroundClip: 'text',
                 color: 'transparent',
                 fontSize: { xs: '1.9rem', md: '2.6rem' },
                 letterSpacing: '-0.5px'
               }}
             >
               Phòng Nổi Bật
             </Typography>
           </Box>
           
           <Divider 
             sx={{ 
               width: 100, 
               height: 4, 
               bgcolor: 'primary.main', 
               mx: 'auto',
               borderRadius: 3 // Thêm border radius cho soft feel
             }} 
           />
         </Box>

                 {loading ? (
           <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
             {[1, 2, 3].map((item) => (
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
           <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
             {rooms.slice(0, 3).map((room) => (
              <Grid item xs={12} sm={6} lg={4} key={room.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    boxShadow: '0 8px 28px -6px rgba(25,118,210,0.25)',
                    border: '1px solid rgba(25,118,210,0.15)',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg,#ffffff 0%,#f6fbff 100%)',
                    backdropFilter: 'blur(4px)',
                    transition: 'all .4s cubic-bezier(.4,0,.2,1)',
                    position: 'relative',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(120deg,rgba(25,118,210,0.08),rgba(66,165,245,0.05) 40%,rgba(255,255,255,0) 70%)',
                      pointerEvents: 'none'
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 18px 50px -12px rgba(25,118,210,0.35)',
                      borderColor: 'rgba(25,118,210,0.35)',
                      '& .room-image': {
                        transform: 'scale(1.05)'
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
                      label={room.status === 'available' ? 'Còn trống' : 'Đã thuê'}
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16,
                        background: room.status === 'available' ? 'linear-gradient(90deg,#1976d2,#42a5f5)' : 'linear-gradient(90deg,#757575,#9e9e9e)',
                        color: 'white',
                        borderRadius: 2,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '.5px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.04)',
                          boxShadow: '0 6px 22px rgba(0,0,0,0.3)'
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
                        fontWeight: 700, 
                        mb: 2,
                        background: 'linear-gradient(90deg,#1976d2,#42a5f5)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      }}
                    >
                      Phòng {room.room_number}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <LocationOn sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                          {room.property?.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <AttachMoney sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
              fontWeight: 800, 
              color: 'primary.main'
                          }}
                        >
                          {new Intl.NumberFormat('vi-VN').format(room.rent_price)} VND
                        </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                          /tháng
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Straighten sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                          {room.area} m²
                        </Typography>
                      </Box>
                    </Box>

                    {room.description && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          lineHeight: 1.55,
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
                        background: 'linear-gradient(90deg,#1976d2,#42a5f5)',
                        color: 'white',
                        borderRadius: 3,
                        py: 1.4,
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        boxShadow: '0 6px 22px rgba(25,118,210,0.35)',
                        '&:hover': {
                          background: 'linear-gradient(90deg,#1565c0,#1e88e5)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 30px rgba(25,118,210,0.45)'
                        },
                        transition: 'all .3s ease'
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