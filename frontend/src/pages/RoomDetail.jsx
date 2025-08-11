import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  Chip,
  Skeleton,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  Fade,
  Tooltip,
  Rating,
  Stack,
  Badge,
  Fab,
  Snackbar,
  Alert,
  TextField,
  DialogTitle,
  DialogActions,
  Avatar,
  LinearProgress,
  Link as MuiLink,
  Breadcrumbs
} from '@mui/material'
import {
  LocationOn,
  Home as HomeIcon,
  Straighten,
  AttachMoney,
  People,
  Phone,
  Email,
  CheckCircle,
  Info,
  Close,
  ArrowBack,
  ArrowForward,
  ZoomIn,
  Favorite,
  FavoriteBorder,
  Share,
  WhatsApp,
  Facebook,
  Twitter,
  ContentCopy,
  CalendarToday,
  Star,
  Wifi,
  LocalParking,
  Security,
  AcUnit,
  Kitchen,
  LocalLaundryService,
  Elevator,
  Balcony,
  Pets,
  SmokingRooms,
  ExpandMore,
  ExpandLess,
  Map,
  DirectionsWalk,
  DirectionsBus,
  School,
  LocalHospital,
  ShoppingCart,
  Restaurant
} from '@mui/icons-material'
import api from '../api'

export default function RoomDetail() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    viewingDate: ''
  })
  const [similarRooms, setSimilarRooms] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)

  useEffect(() => {
    api.get(`/public/rooms/${id}`)
      .then(r => {
        setRoom(r.data)
        // Load similar rooms
        if (r.data) {
          loadSimilarRooms(r.data)
        }
      })
      .catch(() => setRoom(null))
      .finally(() => setLoading(false))
  }, [id])

  // Keyboard navigation for lightbox (Esc to close, arrows to navigate)
  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') handleImageNavigation('next')
      if (e.key === 'ArrowLeft') handleImageNavigation('prev')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen])

  const loadSimilarRooms = async (currentRoom) => {
    setLoadingSimilar(true)
    try {
      const response = await api.get('/public/rooms', {
        params: {
          property_id: currentRoom.property_id,
          min_price: currentRoom.rent_price * 0.8,
          max_price: currentRoom.rent_price * 1.2
        }
      })
      const filtered = response.data
        .filter(r => r.id !== currentRoom.id)
        .slice(0, 3)
      setSimilarRooms(filtered)
    } catch (error) {
      console.error('Error loading similar rooms:', error)
    } finally {
      setLoadingSimilar(false)
    }
  }

  // Helper functions
  const handleImageNavigation = (direction) => {
    if (!room?.room_images?.length) return
    const totalImages = room.room_images.length
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages)
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
    }
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
    setSnackbarMessage(isFavorite ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích')
    setSnackbarOpen(true)
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = `Phòng ${room?.room_number} - ${room?.property?.name}`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setSnackbarMessage('Đã sao chép link')
        setSnackbarOpen(true)
        break
      default:
        break
    }
    setShareDialogOpen(false)
  }

  const handleInquirySubmit = () => {
    // Here you would typically send the inquiry to your backend
    console.log('Inquiry submitted:', inquiryForm)
    setSnackbarMessage('Yêu cầu đã được gửi thành công!')
    setSnackbarOpen(true)
    setContactDialogOpen(false)
    setInquiryForm({ name: '', phone: '', email: '', message: '', viewingDate: '' })
  }

  // Get amenity icon based on asset name and type
  const getAmenityIcon = (assetName, assetType) => {
    const name = (assetName || '').toLowerCase()
    const type = (assetType || '').toLowerCase()
    
    // Check by asset type first
    if (type.includes('điện tử') || type.includes('electronic')) {
      if (name.includes('tivi') || name.includes('tv')) return <CheckCircle />
      if (name.includes('tủ lạnh') || name.includes('refrigerator')) return <Kitchen />
      if (name.includes('máy giặt') || name.includes('washing')) return <LocalLaundryService />
      if (name.includes('điều hòa') || name.includes('air conditioner')) return <AcUnit />
      return <CheckCircle />
    }
    
    if (type.includes('nội thất') || type.includes('furniture')) {
      if (name.includes('giường') || name.includes('bed')) return <CheckCircle />
      if (name.includes('tủ') || name.includes('wardrobe') || name.includes('cabinet')) return <CheckCircle />
      if (name.includes('bàn') || name.includes('table') || name.includes('desk')) return <CheckCircle />
      if (name.includes('ghế') || name.includes('chair')) return <CheckCircle />
      return <CheckCircle />
    }
    
    // Check by name if type doesn't match
    if (name.includes('wifi') || name.includes('mạng') || name.includes('internet')) return <Wifi />
    if (name.includes('parking') || name.includes('xe') || name.includes('gửi xe')) return <LocalParking />
    if (name.includes('security') || name.includes('bảo vệ') || name.includes('an ninh')) return <Security />
    if (name.includes('ac') || name.includes('điều hòa') || name.includes('máy lạnh')) return <AcUnit />
    if (name.includes('kitchen') || name.includes('bếp') || name.includes('nấu ăn')) return <Kitchen />
    if (name.includes('laundry') || name.includes('giặt') || name.includes('máy giặt')) return <LocalLaundryService />
    if (name.includes('elevator') || name.includes('thang máy')) return <Elevator />
    if (name.includes('balcony') || name.includes('ban công')) return <Balcony />
    if (name.includes('pet') || name.includes('thú cưng')) return <Pets />
    if (name.includes('smoke') || name.includes('hút thuốc')) return <SmokingRooms />
    
    return <CheckCircle />
  }

  if (loading) {
    return (
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Skeleton variant="rectangular" width="100%" height={500} sx={{ mb: 2, borderRadius: 3 }} />
              <Grid container spacing={1}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid item xs={3} key={i}>
                    <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
              <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
              <Skeleton variant="text" height={30} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 3, borderRadius: 3 }} />
              <Grid container spacing={2}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid item xs={6} key={i}>
                    <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 3, borderRadius: 3 }} />
          </Grid>
          </Grid>
        </Box>
      </Box>
    )
  }

  if (!room) {
    return (
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ maxWidth: '1600px', mx: 'auto', textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Không tìm thấy thông tin phòng
          </Typography>
          <Button variant="contained" href="/rooms" size="large">
            Quay lại danh sách phòng
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Breadcrumbs + Back Button */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <MuiLink component={Link} underline="hover" color="inherit" to="/">
              Trang chủ
            </MuiLink>
            <MuiLink component={Link} underline="hover" color="inherit" to="/rooms">
              Phòng trọ
            </MuiLink>
            <Typography color="text.primary">Phòng {room.room_number}</Typography>
          </Breadcrumbs>
          <Button
            component={Link}
            to="/rooms"
            startIcon={<ArrowBack />}
            sx={{ mb: 0 }}
          >
            Quay lại danh sách phòng
          </Button>
        </Box>

              <Grid container spacing={4}>
          {/* Left Side - Images */}
          <Grid item xs={12} md={7}>
          {/* Main Image Gallery */}
          <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            {room.room_images && room.room_images.length > 0 ? (
              <Box sx={{ position: 'relative' }}>
                {/* Main Image */}
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: 280, sm: 380, md: 480 },
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover .image-overlay': { opacity: 1 }
                  }}
                  onClick={() => {
                    setLightboxOpen(true)
                  }}
                >
                  <img
                    src={`http://localhost:4000${room.room_images[currentImageIndex]?.image_url}`}
                  alt="Room"
                        style={{
                      width: '100%',
                      height: '100%',
                          objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  {/* Hover Overlay */}
                  <Box
                    className="image-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <ZoomIn sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="h6">Xem ảnh lớn</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Image Navigation Arrows */}
                {room.room_images.length > 1 && (
                  <>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)', transform: 'translateY(-50%) scale(1.1)' },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleImageNavigation('prev')
                      }}
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)', transform: 'translateY(-50%) scale(1.1)' },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleImageNavigation('next')
                      }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </>
                )}

                {/* Image Counter */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {currentImageIndex + 1} / {room.room_images.length}
                  </Typography>
                </Box>

                {/* Status and Action Buttons */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                  <Chip
                    label={room.status === 'available' ? 'Còn trống' : 'Đã thuê'}
                    color={room.status === 'available' ? 'success' : 'default'}
                    sx={{ 
                      fontWeight: 'bold',
                      bgcolor: room.status === 'available' ? 'success.main' : 'grey.500',
                      color: 'white'
                    }}
                  />
                  
                  <Tooltip title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}>
                    <IconButton
                      onClick={handleFavoriteToggle}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                      }}
                    >
                      {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Chia sẻ">
                    <IconButton
                      onClick={() => setShareDialogOpen(true)}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  height: { xs: 280, sm: 380, md: 480 },
                  bgcolor: 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Box sx={{ textAlign: 'center', color: 'grey.500' }}>
                  <HomeIcon sx={{ fontSize: 80, mb: 2 }} />
                  <Typography variant="h6">Hình ảnh sẽ được cập nhật sớm</Typography>
                </Box>
              </Box>
            )}
          </Card>

          {/* Thumbnail Gallery */}
          {room.room_images && room.room_images.length > 1 && (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={1}>
                {room.room_images.map((image, index) => (
                  <Grid item xs={3} sm={2.4} key={index}>
                    <Box
                      onClick={() => {
                        setCurrentImageIndex(index)
                        setLightboxOpen(true)
                      }}
                      sx={{
                        width: '100%',
                        height: { xs: 60, sm: 80 },
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: currentImageIndex === index ? '3px solid' : '2px solid transparent',
                        borderColor: currentImageIndex === index ? 'primary.main' : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <img
                        src={`http://localhost:4000${image.image_url}`}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>

        {/* Right Side - Content */}
        <Grid item xs={12} md={5}>
          <Box sx={{ position: 'sticky', top: 20, pt: 1 }}>
            {/* Room Title and Basic Info */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Phòng {room.room_number}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 500 }}>
                {room.property?.name}
              </Typography>
            </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating value={4.5} precision={0.5} readOnly size="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  4.5/5 (12 đánh giá)
                </Typography>
              </Box>
            </Box>

          {/* Price Section */}
          <Card sx={{ mb: 3, p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)' }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {new Intl.NumberFormat('vi-VN').format(room.rent_price)}
              <Typography component="span" variant="h5" sx={{ ml: 1, opacity: 0.8 }}>
                VND
              </Typography>
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              /tháng • Giá đã bao gồm phí quản lý
            </Typography>
          </Card>

                    {/* Room Stats */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, border: '1px solid #e0e0e0', transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}>
                  <Straighten sx={{ fontSize: 28, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Diện tích
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {room.area} m²
                  </Typography>
              </Card>
              </Grid>
            <Grid item xs={6}>
              <Card sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, border: '1px solid #e0e0e0', transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}>
                  <People sx={{ fontSize: 28, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Sức chứa
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {room.max_tenants} người
                  </Typography>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, border: '1px solid #e0e0e0', transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}>
                <AttachMoney sx={{ fontSize: 28, color: 'success.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Đặt cọc
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(room.rent_price)}
                </Typography>
              </Card>
              </Grid>
            <Grid item xs={6}>
              <Card sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, border: '1px solid #e0e0e0', transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}>
                <CalendarToday sx={{ fontSize: 28, color: 'warning.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Có thể vào
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Ngay
                </Typography>
              </Card>
            </Grid>
            </Grid>
          </Box>

          {/* Contact Card */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    mx: 'auto', 
                    mb: 2, 
                    bgcolor: 'primary.main',
                    fontSize: '1.5rem'
                  }}
                >
                  👨‍💼
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Quản trị hệ thống
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chủ trọ • Online
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Phone />}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                  }}
                >
                  Gọi ngay: 0123 456 789
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<WhatsApp />}
                  sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                >
                  Chat WhatsApp
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<CalendarToday />}
                  onClick={() => setContactDialogOpen(true)}
                  sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                >
                  Đặt lịch xem phòng
                </Button>
              </Stack>

              <Box sx={{ mt: 3, p: 2.5, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
                <Typography variant="body2" color="success.dark" sx={{ fontWeight: 500, textAlign: 'center' }}>
                  🎉 <strong>Ưu đãi:</strong> Miễn phí tháng đầu cho khách thuê trước 31/12!
                </Typography>
              </Box>
            </CardContent>
          </Card>

            {room.description && (
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 2 }}>
                  📝 Mô tả chi tiết
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                  {room.description}
                </Typography>
              </CardContent>
            </Card>
          )}
          </Box>
          </Grid>
        </Grid>

        {/* Enhanced Room Features */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 3 }}>
            ✨ Tiện nghi & Nội thất
            </Typography>
            
            {room.assets && room.assets.length > 0 ? (
              <Box>
              <Grid container spacing={2}>
                  {(showAllAmenities ? room.assets : room.assets.slice(0, 6)).map((asset) => (
                    <Grid item xs={12} sm={6} md={4} key={asset.id}>
                      <Card 
                        sx={{ 
                          p: 2.5, 
                          height: '100%',
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                            transform: 'translateY(-2px)',
                            borderColor: 'primary.main'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                          <Box sx={{ color: 'primary.main', mr: 1.5, mt: 0.5 }}>
                            {getAmenityIcon(asset.name, asset.asset_type?.name)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {asset.name}
                        </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {asset.asset_type?.name || 'Nội thất'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                          {asset.status && (
                            <Chip 
                              label={
                                asset.status === 'in_use' ? 'Hoạt động' :
                                asset.status === 'in_storage' ? 'Lưu kho' :
                                asset.status === 'under_repair' ? 'Sửa chữa' :
                                asset.status === 'disposed' ? 'Thanh lý' : asset.status
                              }
                              size="small"
                              color={asset.status === 'in_use' ? 'success' : 'default'}
                              variant="outlined"
                            />
                          )}
                          {asset.value && asset.value > 0 && (
                            <Chip 
                              label={`${new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(asset.value)}₫`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          )}
                        </Stack>

                        {asset.serial_number && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            S/N: {asset.serial_number}
                          </Typography>
                        )}
                        
                        {asset.warranty_end_date && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            BH đến: {new Date(asset.warranty_end_date).toLocaleDateString('vi-VN')}
                        </Typography>
                        )}
                        
                        {asset.notes && (
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            display: 'block', 
                            mt: 1,
                            fontStyle: 'italic',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {asset.notes}
                          </Typography>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {room.assets.length > 6 && (
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                      onClick={() => setShowAllAmenities(!showAllAmenities)}
                      endIcon={showAllAmenities ? <ExpandLess /> : <ExpandMore />}
                      variant="outlined"
                    >
                      {showAllAmenities ? 'Thu gọn' : `Xem thêm ${room.assets.length - 6} tiện nghi`}
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                {[
                  { name: 'Wifi miễn phí', icon: <Wifi /> },
                  { name: 'WC riêng', icon: <CheckCircle /> },
                  { name: 'Có gác lửng', icon: <HomeIcon /> },
                  { name: 'Cửa sổ thoáng mát', icon: <CheckCircle /> },
                  { name: 'An ninh 24/7', icon: <Security /> },
                  { name: 'Khu để xe', icon: <LocalParking /> }
                ].map((amenity, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card 
                      sx={{ 
                        p: 2.5, 
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                          transform: 'translateY(-2px)',
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ color: 'success.main', mr: 1.5 }}>
                          {amenity.icon}
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {amenity.name}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>

        {/* Location & Nearby */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 3 }}>
              📍 Vị trí & Tiện ích xung quanh
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%', bgcolor: 'primary.50' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <Map sx={{ mr: 1 }} />
                    Địa chỉ
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {room.property?.address || 'Địa chỉ sẽ được cập nhật'}
              </Typography>
                  <Button variant="outlined" startIcon={<DirectionsWalk />} size="small">
                    Xem bản đồ
                  </Button>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Tiện ích lân cận
                </Typography>
                <Stack spacing={2}>
                  {[
                    { icon: <DirectionsBus />, name: 'Trạm xe bus', distance: '200m' },
                    { icon: <School />, name: 'Trường đại học', distance: '500m' },
                    { icon: <ShoppingCart />, name: 'Siêu thị', distance: '300m' },
                    { icon: <Restaurant />, name: 'Khu ẩm thực', distance: '100m' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ color: 'primary.main', mr: 2 }}>
                        {item.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.name}
                        </Typography>
                      </Box>
                      <Chip label={item.distance} size="small" color="primary" variant="outlined" />
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
        </Paper>

        {/* Similar Rooms Section */}
        {similarRooms.length > 0 && (
          <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 4, textAlign: 'center' }}>
            🏠 Phòng tương tự bạn có thể quan tâm
          </Typography>
          
          <Grid container spacing={3}>
            {similarRooms.map((similarRoom) => (
              <Grid item xs={12} sm={6} md={4} key={similarRoom.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(`/rooms/${similarRoom.id}`, '_blank')}
                >
                  <Box sx={{ position: 'relative' }}>
                    {similarRoom.room_images && similarRoom.room_images.length > 0 ? (
                      <CardMedia
                        component="img"
                        sx={{ height: 200, objectFit: 'cover' }}
                        image={`http://localhost:4000${similarRoom.room_images[0].image_url}`}
                        alt={`Room ${similarRoom.room_number}`}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <HomeIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                      </Box>
                    )}
                    
                    <Chip
                      label={similarRoom.status === 'available' ? 'Còn trống' : 'Đã thuê'}
                      color={similarRoom.status === 'available' ? 'success' : 'default'}
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12,
                        fontWeight: 'bold',
                        bgcolor: similarRoom.status === 'available' ? 'success.main' : 'grey.500',
                        color: 'white'
                      }}
                    />
                  </Box>
                  
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Phòng {similarRoom.room_number}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {similarRoom.property?.name}
                </Typography>
              </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Straighten sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2">{similarRoom.area} m²</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <People sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2">{similarRoom.max_tenants} người</Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(similarRoom.rent_price)} VND
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        /tháng
                  </Typography>
                </Box>
                    
                    {/* Price comparison */}
                    {similarRoom.rent_price !== room.rent_price && (
                      <Box sx={{ mt: 1 }}>
                        {similarRoom.rent_price < room.rent_price ? (
                          <Chip 
                            label={`Rẻ hơn ${new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(room.rent_price - similarRoom.rent_price)} VND`}
                            size="small" 
                            color="success" 
                            variant="outlined"
                          />
                        ) : (
                          <Chip 
                            label={`Đắt hơn ${new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(similarRoom.rent_price - room.rent_price)} VND`}
                            size="small" 
                            color="warning" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {loadingSimilar && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <LinearProgress sx={{ width: '50%' }} />
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="outlined" 
              size="large" 
              component={Link}
              to="/rooms"
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Xem tất cả phòng trống
            </Button>
          </Box>
          </Box>
        )}

      </Box>

      {/* Image Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{ '& .MuiDialog-paper': { bgcolor: 'black' } }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            <Close />
          </IconButton>
          
          {room?.room_images && room.room_images.length > 0 && (
            <Box sx={{ position: 'relative' }}>
              <img
                src={`http://localhost:4000${room.room_images[currentImageIndex]?.image_url}`}
                alt="Room"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
              />
              
              {room.room_images.length > 1 && (
                <>
                  <IconButton
                    onClick={() => handleImageNavigation('prev')}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <IconButton
                    onClick={() => handleImageNavigation('next')}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                  >
                    <ArrowForward />
                  </IconButton>
                </>
              )}
              
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.7)',
                  px: 2,
                  py: 1,
                  borderRadius: 2
                }}
              >
                <Typography variant="body2">
                  {currentImageIndex + 1} / {room.room_images.length}
                  </Typography>
                </Box>
              </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Sticky mobile CTA bar */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          display: { xs: 'block', md: 'none' },
          zIndex: 1100,
          p: 2,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Giá thuê</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {new Intl.NumberFormat('vi-VN').format(room.rent_price)} VND/tháng
            </Typography>
          </Box>
          <Button variant="contained" size="large" onClick={() => setContactDialogOpen(true)}>
            Đặt lịch xem
          </Button>
        </Box>
      </Paper>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            🔗 Chia sẻ phòng này
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                onClick={() => handleShare('facebook')}
                sx={{ py: 2, color: '#1877f2', borderColor: '#1877f2' }}
              >
                Facebook
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Twitter />}
                onClick={() => handleShare('twitter')}
                sx={{ py: 2, color: '#1da1f2', borderColor: '#1da1f2' }}
              >
                Twitter
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<WhatsApp />}
                onClick={() => handleShare('whatsapp')}
                sx={{ py: 2, color: '#25d366', borderColor: '#25d366' }}
              >
                WhatsApp
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={() => handleShare('copy')}
                sx={{ py: 2 }}
              >
                Sao chép link
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Contact/Booking Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            📅 Đặt lịch xem phòng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phòng {room?.room_number} - {room?.property?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={inquiryForm.phone}
                onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ngày muốn xem phòng"
                type="datetime-local"
                value={inquiryForm.viewingDate}
                onChange={(e) => setInquiryForm({...inquiryForm, viewingDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Tin nhắn (tùy chọn)"
                placeholder="Cho chúng tôi biết thêm về yêu cầu của bạn..."
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, p: 3, bgcolor: 'info.50', borderRadius: 2 }}>
                <Typography variant="body2" color="info.main">
              💡 <strong>Lưu ý:</strong> Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận lịch hẹn.
                </Typography>
              </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setContactDialogOpen(false)}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleInquirySubmit}
            disabled={!inquiryForm.name || !inquiryForm.phone || !inquiryForm.email}
            sx={{ px: 4 }}
          >
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
        onClick={() => setContactDialogOpen(true)}
      >
        <Phone />
      </Fab>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}


