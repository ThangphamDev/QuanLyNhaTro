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
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Skeleton,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
  Stack,
  IconButton
} from '@mui/material'
import {
  LocationOn,
  Home as HomeIcon,
  Straighten,
  AttachMoney,
  FilterList,
  Search,
  People,
  ViewModule,
  ViewList,
  Sort
} from '@mui/icons-material'
import api from '../api'

export default function Rooms() {
  const [filters, setFilters] = useState({ 
    property_id: '', 
    min_price: '', 
    max_price: '', 
    min_area: '', 
    max_area: '' 
  })
  const [rooms, setRooms] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // grid | list
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(12)

  const load = () => {
    setSearching(true)
  api.get('/public/rooms', { params: { ...filters, include_all: 1 } })
      .then(r => setRooms(r.data))
      .catch(() => setRooms([]))
      .finally(() => setSearching(false))
  }

  useEffect(() => {
    Promise.all([
      api.get('/public/properties').catch(() => ({ data: [] })),
      api.get('/public/rooms', { params: { include_all: 1 } }).catch(() => ({ data: [] }))
    ]).then(([propsRes, roomsRes]) => {
      setProperties(propsRes.data)
      setRooms(roomsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const resetFilters = () => {
    setFilters({ property_id: '', min_price: '', max_price: '', min_area: '', max_area: '' })
  }

  // Derived rooms: local availability filter + sort + pagination
  const getProcessedRooms = () => {
    let data = [...rooms]
    if (onlyAvailable) {
      data = data.filter(r => r.status === 'available')
    }
    switch (sortBy) {
      case 'price_asc':
        data.sort((a, b) => (a.rent_price || 0) - (b.rent_price || 0))
        break
      case 'price_desc':
        data.sort((a, b) => (b.rent_price || 0) - (a.rent_price || 0))
        break
      case 'area_asc':
        data.sort((a, b) => (a.area || 0) - (b.area || 0))
        break
      case 'area_desc':
        data.sort((a, b) => (b.area || 0) - (a.area || 0))
        break
      default:
        // newest: assume larger id is newer
        data.sort((a, b) => (b.id || 0) - (a.id || 0))
    }
    return data
  }

  const processedRooms = getProcessedRooms()
  const totalPages = Math.max(1, Math.ceil(processedRooms.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const pagedRooms = processedRooms.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: '60vh'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
            zIndex: 1
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold', 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              🏠 Tìm Phòng Trọ Lý Tưởng
            </Typography>
            <Typography variant="h5" sx={{ 
              mb: 3, 
              opacity: 0.9, 
              maxWidth: 600, 
              mx: 'auto',
              lineHeight: 1.4
            }}>
              Khám phá hàng trăm phòng trọ chất lượng cao với giá cả phải chăng
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 4, 
              flexWrap: 'wrap',
              mt: 4 
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {rooms.length}+
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Phòng trọ
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {properties.length}+
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Khu trọ
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {rooms.filter(r => r.status === 'available').length}+
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Còn trống
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -6, position: 'relative', zIndex: 3 }}>
        
        {/* Enhanced Filter Card */}
        <Paper 
          elevation={12} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 2,
                mr: 2
              }}
            >
              <FilterList />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Bộ Lọc Tìm Kiếm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sử dụng các bộ lọc để tìm phòng trọ phù hợp nhất
              </Typography>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>🏘️ Khu trọ</InputLabel>
                <Select
                  value={filters.property_id}
                  label="🏘️ Khu trọ"
                  onChange={(e) => handleFilterChange('property_id', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Tất cả khu</MenuItem>
                  {properties.map(p => (
                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                fullWidth
                label="💰 Giá tối thiểu"
                type="number"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: <Typography variant="caption" color="text.secondary">VND</Typography>
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                fullWidth
                label="💰 Giá tối đa"
                type="number"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: <Typography variant="caption" color="text.secondary">VND</Typography>
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                fullWidth
                label="📐 DT tối thiểu"
                type="number"
                value={filters.min_area}
                onChange={(e) => handleFilterChange('min_area', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: <Typography variant="caption" color="text.secondary">m²</Typography>
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                fullWidth
                label="📐 DT tối đa"
                type="number"
                value={filters.max_area}
                onChange={(e) => handleFilterChange('max_area', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: <Typography variant="caption" color="text.secondary">m²</Typography>
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={1}>
              <Button
                variant="contained"
                fullWidth
                onClick={load}
                disabled={searching}
                startIcon={<Search />}
                sx={{
                  height: 56,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976d2 30%, #1e88e5 90%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 10px 2px rgba(33, 203, 243, .3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {searching ? 'Đang tìm...' : 'Tìm kiếm'}
              </Button>
            </Grid>
          </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box>
              <Button variant="text" onClick={resetFilters} sx={{ mr: 1 }}>
                Xóa bộ lọc
              </Button>
              <Chip
                label={onlyAvailable ? 'Chỉ hiển thị: Còn trống' : 'Bao gồm phòng đã thuê'}
                color={onlyAvailable ? 'success' : 'default'}
                onClick={() => { setOnlyAvailable(v => !v); setPage(1) }}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            {/* Sort and view controls */}
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp"
                  onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                >
                  <MenuItem value="newest"><Sort sx={{ mr: 1 }} /> Mới nhất</MenuItem>
                  <MenuItem value="price_asc">Giá tăng dần</MenuItem>
                  <MenuItem value="price_desc">Giá giảm dần</MenuItem>
                  <MenuItem value="area_asc">Diện tích tăng dần</MenuItem>
                  <MenuItem value="area_desc">Diện tích giảm dần</MenuItem>
                </Select>
              </FormControl>
              <ToggleButtonGroup
                size="small"
                value={viewMode}
                exclusive
                onChange={(e, v) => v && setViewMode(v)}
              >
                <ToggleButton value="grid" aria-label="Grid view">
                  <ViewModule fontSize="small" />
                </ToggleButton>
                <ToggleButton value="list" aria-label="List view">
                  <ViewList fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        </Box>
      </Paper>

        {/* Enhanced Results Section */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 3,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {searching ? '🔍 Đang tìm kiếm...' : `✨ Tìm thấy ${processedRooms.length} phòng`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {processedRooms.filter(r => r.status === 'available').length} phòng còn trống
            </Typography>
          </Box>
          <FormControl size="small">
            <InputLabel>Hiển thị</InputLabel>
            <Select 
              value={perPage} 
              label="Hiển thị" 
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }} 
              sx={{ minWidth: 100, borderRadius: 2 }}
            >
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={18}>18</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Enhanced Loading Skeleton */}
        {loading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Skeleton variant="rectangular" width="100%" height={240} />
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {viewMode === 'grid' ? (
        <Grid container spacing={4}>
                {pagedRooms.map((room) => (
          <Grid item xs={12} sm={6} md={3} key={room.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        border: '1px solid #e3f2fd',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                          '& .room-image': {
                            transform: 'scale(1.05)'
                          }
                        }
                      }}
                    >
                      <CardMedia 
                        component="div" 
                        sx={{ 
                          height: 220, 
                          position: 'relative', 
                          overflow: 'hidden',
                          background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)'
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
                              transition: 'transform 0.3s ease'
                            }} 
                          />
                        ) : (
                          <Box sx={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexDirection: 'column'
                          }}>
                            <HomeIcon sx={{ fontSize: 60, color: 'grey.400', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              Hình ảnh đang cập nhật
                            </Typography>
                          </Box>
                        )}
                        
                        {/* Status Badge */}
                        <Chip 
                          label={room.status === 'available' ? '✅ Còn trống' : '❌ Đã thuê'} 
                          color={room.status === 'available' ? 'success' : 'default'} 
                          size="small" 
                          sx={{ 
                            position: 'absolute', 
                            top: 12, 
                            right: 12,
                            fontWeight: 'bold',
                            backdropFilter: 'blur(10px)',
                            bgcolor: room.status === 'available' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(158, 158, 158, 0.9)',
                            color: 'white'
                          }} 
                        />
                        
                        {/* Price Badge */}
                        <Box sx={{ 
                          position: 'absolute', 
                          bottom: 12, 
                          left: 12, 
                          right: 12,
                          background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.95), rgba(30, 136, 229, 0.95))',
                          backdropFilter: 'blur(10px)',
                          color: 'white', 
                          px: 2, 
                          py: 1, 
                          borderRadius: 2,
                          textAlign: 'center'
                        }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {new Intl.NumberFormat('vi-VN').format(room.rent_price)} VND
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            /tháng
                          </Typography>
                        </Box>
                      </CardMedia>
                      
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h6" component="h3" gutterBottom sx={{ 
                          fontWeight: 'bold', 
                          mb: 2,
                          fontSize: '1.2rem'
                        }}>
                          🏠 Phòng {room.room_number}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                          <LocationOn sx={{ fontSize: 18, color: 'primary.main' }} />
                          <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                            {room.property?.name}
                          </Typography>
                        </Stack>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip 
                            icon={<Straighten />} 
                            label={`${room.area} m²`} 
                            size="small" 
                            variant="outlined" 
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                          />
                          <Chip 
                            icon={<People />} 
                            label={`${room.max_tenants} người`} 
                            size="small" 
                            variant="outlined" 
                            color="secondary"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                        
                        {room.description && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mt: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.4
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
                          size="large"
                          sx={{
                            borderRadius: 2,
                            py: 1.2,
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #1976d2 30%, #1e88e5 90%)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 6px 10px 2px rgba(33, 203, 243, .3)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          🔍 Xem Chi Tiết
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Stack spacing={2}>
                {pagedRooms.map((room) => (
                  <Card key={room.id} sx={{ p: 3, borderRadius: 3, display: 'flex', gap: 3, alignItems: 'stretch', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Box sx={{ width: 220, height: 160, borderRadius: 2, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      {room.room_images && room.room_images.length > 0 ? (
            <img src={`http://localhost:4000${room.room_images[0].image_url}`} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
            <Box sx={{ width: '100%', height: '100%', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <HomeIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                        </Box>
                      )}
                      <Chip 
                        label={room.status === 'available' ? '✅ Còn trống' : '❌ Đã thuê'} 
                        size="small" 
                        color={room.status === 'available' ? 'success' : 'default'} 
                        sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 'bold' }} 
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>🏠 Phòng {room.room_number}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <LocationOn sx={{ fontSize: 16, color: 'primary.main' }} />
                            <Typography variant="body2" color="text.secondary">{room.property?.name}</Typography>
                          </Stack>
                        </Box>
                        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                          {new Intl.NumberFormat('vi-VN').format(room.rent_price)} VND/tháng
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Chip label={`📐 ${room.area} m²`} size="small" variant="outlined" color="primary" />
                        <Chip label={`👥 ${room.max_tenants} người`} size="small" variant="outlined" color="secondary" />
                      </Stack>
                      {room.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          {room.description.length > 140 ? room.description.substring(0, 140) + '...' : room.description}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button 
                        component={Link} 
                        to={`/rooms/${room.id}`} 
                        variant="contained"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 'bold',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                        }}
                      >
                        🔍 Xem chi tiết
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Stack>
            )}

            {/* Enhanced Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination 
                color="primary" 
                count={totalPages} 
                page={currentPage} 
                onChange={(e, val) => setPage(val)} 
                shape="rounded" 
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }
                }}
              />
            </Box>
          </>
        )}

        {!loading && processedRooms.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                p: 6,
                borderRadius: 4,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
                🔍 Không tìm thấy phòng nào
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                Không có phòng trọ phù hợp với bộ lọc của bạn
              </Typography>
              <Button
                variant="contained"
                onClick={resetFilters}
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                }}
              >
                🔄 Xóa Bộ Lọc
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}


