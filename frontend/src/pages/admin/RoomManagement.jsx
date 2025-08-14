import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Home as RoomIcon,
  PhotoCamera,
  Close,
  Inventory,
  CloudUpload,
  Star,
  StarBorder,
  DeleteOutline,
  Info,
  Image,
  Settings
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import api from '../../api'

export default function RoomManagement() {
  const [rooms, setRooms] = useState([])
  const [properties, setProperties] = useState([])
  const [assetTypes, setAssetTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [error, setError] = useState('')
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [defaultImageIndex, setDefaultImageIndex] = useState(0)
  const [existingImages, setExistingImages] = useState([])
  const [imagesToDelete, setImagesToDelete] = useState([])
  const [roomAssets, setRoomAssets] = useState([])
  const [currentTab, setCurrentTab] = useState(0)
  const [availableAssets, setAvailableAssets] = useState([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [roomDetail, setRoomDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [roomContracts, setRoomContracts] = useState([])
  const [detailImageIndex, setDetailImageIndex] = useState(0)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm()

  const loadData = async () => {
    try {
      const [roomsRes, propertiesRes, assetTypesRes, availableAssetsRes] = await Promise.all([
        api.get('/admin/rooms'),
        api.get('/admin/properties'),
        api.get('/admin/asset-types'),
        api.get('/admin/available-assets')
      ])
      setRooms(roomsRes.data)
      setProperties(propertiesRes.data)
      setAssetTypes(assetTypesRes.data)

      let avail = availableAssetsRes?.data || []
      // Fallback: if empty, load all assets and filter those not linked to any room
      if (!Array.isArray(avail) || avail.length === 0) {
        try {
          const allAssetsRes = await api.get('/admin/assets')
          avail = (allAssetsRes.data || []).filter(a => !a.room_id)
        } catch {}
      }
      setAvailableAssets(avail)
    } catch (error) {
      console.error('Failed to load data:', error)
      // Last resort fallback for available assets
      try {
        const allAssetsRes = await api.get('/admin/assets')
        setAvailableAssets((allAssetsRes.data || []).filter(a => !a.room_id))
      } catch {}
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Cleanup function to revoke object URLs
  useEffect(() => {
    return () => {
      imagePreview.forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url)
        }
      })
    }
  }, [imagePreview])

  const handleAdd = () => {
    setEditingRoom(null)
    setSelectedImages([])
    setImagePreview([])
    setDefaultImageIndex(0)
    setExistingImages([])
    setImagesToDelete([])
    setRoomAssets([])
    setCurrentTab(0)
    reset({
      status: 'available',
      max_tenants: 1
    })
    setDialogOpen(true)
  }

  const handleEdit = async (room) => {
    // Load fresh room data with assets
    try {
      const roomRes = await api.get(`/admin/rooms/${room.id}`)
      const freshRoom = roomRes.data
      
      setEditingRoom(freshRoom)
      setSelectedImages([])
      setImagePreview([])
      setExistingImages(freshRoom.room_images || [])
      setImagesToDelete([])
      setDefaultImageIndex(0)
      // Store full asset objects for display, but only send IDs to backend
      setRoomAssets(freshRoom.assets || [])
      setCurrentTab(0)
      reset({
        ...freshRoom,
        property_id: freshRoom.property_id || freshRoom.property?.id
      })
      setDialogOpen(true)
    } catch (error) {
      // Fallback to original room data
      setEditingRoom(room)
      setSelectedImages([])
      setImagePreview([])
      setExistingImages(room.room_images || [])
      setImagesToDelete([])
      setDefaultImageIndex(0)
      setRoomAssets(room.assets || [])
      setCurrentTab(0)
      reset({
        ...room,
        property_id: room.property_id || room.property?.id
      })
      setDialogOpen(true)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        await api.delete(`/admin/rooms/${id}`)
        loadData()
      } catch (error) {
        alert('Xóa thất bại')
      }
    }
  }

  const openDetail = async (room) => {
    setDetailLoading(true)
    setDetailImageIndex(0)
    try {
      const [roomRes, contractsRes] = await Promise.all([
        api.get(`/admin/rooms/${room.id}`),
        api.get('/admin/contracts')
      ])
      setRoomDetail(roomRes.data)
      setRoomContracts((contractsRes.data || []).filter(c => c.room_id === room.id))
      setDetailOpen(true)
    } catch (e) {
      // fallback minimal
      setRoomDetail(room)
      setRoomContracts([])
      setDetailOpen(true)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files)
    setSelectedImages(files)
    
    // Create preview URLs for selected images
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isDefault: false
    }))
    setImagePreview(previews)
  }

  const removeSelectedImage = (index) => {
    const newSelectedImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreview.filter((_, i) => i !== index)
    
    setSelectedImages(newSelectedImages)
    setImagePreview(newPreviews)
    
    // Adjust default image index if needed
    if (defaultImageIndex >= newPreviews.length && newPreviews.length > 0) {
      setDefaultImageIndex(0)
    }
  }

  const setAsDefaultImage = (index, isExisting = false) => {
    if (isExisting) {
      const updatedImages = existingImages.map((img, i) => ({
        ...img,
        is_default: i === index
      }))
      setExistingImages(updatedImages)
    } else {
      setDefaultImageIndex(index)
    }
  }

  const deleteExistingImage = (imageId) => {
    setImagesToDelete([...imagesToDelete, imageId])
    setExistingImages(existingImages.filter(img => img.id !== imageId))
  }



  const removeAsset = (index) => {
    setRoomAssets(roomAssets.filter((_, i) => i !== index))
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  const addAssetFromDatabase = (asset) => {
    // Check if asset is already added
    if (roomAssets.some(a => a.id === asset.id)) {
      alert('Tài sản này đã được thêm vào phòng.');
      return;
    }
    
    // Store full asset object for display, but only send ID to backend
    setRoomAssets(prev => [...prev, asset])
  }

  const onSubmit = async (data) => {
    try {
      setError('')
      
      const formData = new FormData()
      
      // Add room data
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key])
        }
      })
      
      // Add assets - only send IDs to backend
      if (roomAssets.length > 0) {
        const assetIds = roomAssets.map(asset => ({ id: asset.id }))
        formData.append('assets', JSON.stringify(assetIds))
      }
      
      // Add images
      selectedImages.forEach((image, index) => {
        formData.append('images', image)
        if (index === defaultImageIndex) {
          formData.append('defaultImageIndex', index.toString())
        }
      })

      // Add information about images to delete
      if (imagesToDelete.length > 0) {
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete))
      }

      // Add existing images with default info
      if (existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingImages))
      }

      if (editingRoom) {
        await api.put(`/admin/rooms/${editingRoom.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/admin/rooms', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      
      setDialogOpen(false)
      loadData()
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const getStatusChip = (status) => {
    const statusConfig = {
      available: { label: 'Còn trống', color: 'success' },
      occupied: { label: 'Đang thuê', color: 'warning' },
      reserved: { label: 'Đã đặt', color: 'info' },
      maintenance: { label: 'Bảo trì', color: 'error' }
    }
    const config = statusConfig[status] || { label: status, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <RoomIcon sx={{ mr: 1 }} />
          Quản lý Phòng
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Thêm Phòng
        </Button>
      </Box>
      
      {/* Room Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Ảnh</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Số phòng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Khu trọ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Diện tích (m²)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Giá thuê</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nội thất</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id} hover>
                <TableCell>
                  {room.room_images && room.room_images.length > 0 ? (
                    <img
                      src={`http://localhost:4000${room.room_images[0].image_url}`}
                      alt="Room"
                      style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : (
                    <Box sx={{ width: 60, height: 40, bgcolor: 'grey.200', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RoomIcon sx={{ color: 'grey.400' }} />
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{room.room_number}</TableCell>
                <TableCell>{room.property?.name}</TableCell>
                <TableCell>{room.area}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('vi-VN').format(room.rent_price)} VND
                </TableCell>
                <TableCell>
                  <Chip label={room.assets?.length || 0} color="primary" size="small" />
                </TableCell>
                <TableCell>{getStatusChip(room.status)}</TableCell>
                <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => openDetail(room)}
                      sx={{ mr: 1 }}
                    >
                      <Info />
                    </IconButton>
                    <IconButton
                    color="primary"
                    onClick={() => handleEdit(room)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(room.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center',
            py: 2
          }}>
            {editingRoom ? (
              <>
                <Edit sx={{ mr: 1 }} />
                Sửa Phòng - {editingRoom.room_number}
              </>
            ) : (
              <>
                <Add sx={{ mr: 1 }} />
                Thêm Phòng Mới
              </>
            )}
          </DialogTitle>
          
          <DialogContent sx={{ p: 0 }}>
            {error && <Alert severity="error" sx={{ m: 3, mb: 0 }}>{error}</Alert>}
            
            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&.Mui-selected': {
                      color: 'primary.main',
                      bgcolor: 'white'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    height: 4,
                    bgcolor: 'primary.main'
                  }
                }}
              >
                <Tab 
                  icon={<Info sx={{ mb: 1 }} />} 
                  label="Thông tin cơ bản" 
                  iconPosition="top"
                />
                <Tab 
                  icon={<Image sx={{ mb: 1 }} />} 
                  label="Hình ảnh phòng" 
                  iconPosition="top"
                />
                <Tab 
                  icon={<Settings sx={{ mb: 1 }} />} 
                  label="Nội thất & Tài sản" 
                  iconPosition="top"
                />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 3 }}>
              {/* Tab 0: Basic Information */}
              {currentTab === 0 && (
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 4, 
                    border: '2px solid',
                    borderColor: 'primary.100',
                    borderRadius: 3,
                    bgcolor: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
                      backgroundSize: '200% 100%',
                      animation: 'gradient 3s ease infinite'
                    },
                    '@keyframes gradient': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' }
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Box 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: 2
                      }}
                    >
                      <RoomIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 'bold',
                          mb: 0.5
                        }}
                      >
                        Thông tin cơ bản
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontStyle: 'italic'
                        }}
                      >
                        Nhập thông tin chi tiết về phòng cho thuê
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="property_id"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Vui lòng chọn khu trọ' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.property_id}>
                            <InputLabel sx={{ color: 'text.secondary', fontWeight: 500 }}>
                              Khu trọ *
                            </InputLabel>
                            <Select 
                              {...field} 
                              label="Khu trọ *"
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 3,
                                  bgcolor: 'grey.50',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    bgcolor: 'grey.100'
                                  },
                                  '&.Mui-focused': {
                                    bgcolor: 'white',
                                    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                                  }
                                },
                                '& .MuiSelect-icon': {
                                  color: 'primary.main'
                                }
                              }}
                            >
                              {properties.map((property) => (
                                <MenuItem 
                                  key={property.id} 
                                  value={property.id}
                                  sx={{ 
                                    borderRadius: 1,
                                    mx: 1,
                                    mb: 0.5,
                                    '&:hover': {
                                      bgcolor: 'primary.50'
                                    }
                                  }}
                                >
                                  {property.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.property_id && (
                              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '4px' }}>⚠️</span>
                                {errors.property_id.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Số phòng *"
                        {...register('room_number', { required: 'Số phòng là bắt buộc' })}
                        error={!!errors.room_number}
                        helperText={errors.room_number?.message}
                        placeholder="VD: 001, A101, Tầng 2..."
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'grey.50',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'grey.100'
                            },
                            '&.Mui-focused': {
                              bgcolor: 'white',
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'text.secondary',
                            fontWeight: 500
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Diện tích *"
                        type="number"
                        {...register('area', { required: 'Diện tích là bắt buộc', min: 1 })}
                        error={!!errors.area}
                        helperText={errors.area?.message}
                        placeholder="VD: 25.5"
                        InputProps={{
                          endAdornment: (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              px: 1,
                              bgcolor: 'primary.50',
                              borderRadius: 1,
                              mx: 1
                            }}>
                              <Typography variant="body2" color="primary.main" fontWeight="bold">
                                m²
                              </Typography>
                            </Box>
                          )
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'grey.50',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'grey.100'
                            },
                            '&.Mui-focused': {
                              bgcolor: 'white',
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'text.secondary',
                            fontWeight: 500
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Giá thuê *"
                        type="number"
                        {...register('rent_price', { required: 'Giá thuê là bắt buộc', min: 0 })}
                        error={!!errors.rent_price}
                        helperText={errors.rent_price?.message}
                        placeholder="VD: 3500000"
                        InputProps={{
                          endAdornment: (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              px: 1,
                              bgcolor: 'success.50',
                              borderRadius: 1,
                              mx: 1
                            }}>
                              <Typography variant="body2" color="success.main" fontWeight="bold">
                                VND
                              </Typography>
                            </Box>
                          )
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'grey.50',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'grey.100'
                            },
                            '&.Mui-focused': {
                              bgcolor: 'white',
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'text.secondary',
                            fontWeight: 500
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Số người tối đa"
                        type="number"
                        defaultValue={1}
                        {...register('max_tenants', { min: 1 })}
                        error={!!errors.max_tenants}
                        helperText={errors.max_tenants?.message}
                        placeholder="VD: 2"
                        InputProps={{
                          endAdornment: (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              px: 1,
                              bgcolor: 'info.50',
                              borderRadius: 1,
                              mx: 1
                            }}>
                              <Typography variant="body2" color="info.main" fontWeight="bold">
                                người
                              </Typography>
                            </Box>
                          )
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'grey.50',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'grey.100'
                            },
                            '&.Mui-focused': {
                              bgcolor: 'white',
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'text.secondary',
                            fontWeight: 500
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue="available"
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel sx={{ color: 'text.secondary', fontWeight: 500 }}>
                              Trạng thái
                            </InputLabel>
                            <Select 
                              {...field} 
                              label="Trạng thái"
                              sx={{ 
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 3,
                                  bgcolor: 'grey.50',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    bgcolor: 'grey.100'
                                  },
                                  '&.Mui-focused': {
                                    bgcolor: 'white',
                                    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                                  }
                                },
                                '& .MuiSelect-icon': {
                                  color: 'primary.main'
                                }
                              }}
                            >
                              <MenuItem 
                                value="available"
                                sx={{ 
                                  borderRadius: 1,
                                  mx: 1,
                                  mb: 0.5,
                                  '&:hover': {
                                    bgcolor: 'success.50'
                                  }
                                }}
                              >
                                <Chip 
                                  label="Còn trống" 
                                  color="success" 
                                  size="small" 
                                  sx={{ mr: 1, fontWeight: 'bold' }} 
                                />
                                Còn trống
                              </MenuItem>
                              <MenuItem 
                                value="occupied"
                                sx={{ 
                                  borderRadius: 1,
                                  mx: 1,
                                  mb: 0.5,
                                  '&:hover': {
                                    bgcolor: 'warning.50'
                                  }
                                }}
                              >
                                <Chip 
                                  label="Đang thuê" 
                                  color="warning" 
                                  size="small" 
                                  sx={{ mr: 1, fontWeight: 'bold' }} 
                                />
                                Đang thuê
                              </MenuItem>
                              <MenuItem 
                                value="reserved"
                                sx={{ 
                                  borderRadius: 1,
                                  mx: 1,
                                  mb: 0.5,
                                  '&:hover': {
                                    bgcolor: 'info.50'
                                  }
                                }}
                              >
                                <Chip 
                                  label="Đã đặt" 
                                  color="info" 
                                  size="small" 
                                  sx={{ mr: 1, fontWeight: 'bold' }} 
                                />
                                Đã đặt
                              </MenuItem>
                              <MenuItem 
                                value="maintenance"
                                sx={{ 
                                  borderRadius: 1,
                                  mx: 1,
                                  mb: 0.5,
                                  '&:hover': {
                                    bgcolor: 'error.50'
                                  }
                                }}
                              >
                                <Chip 
                                  label="Bảo trì" 
                                  color="error" 
                                  size="small" 
                                  sx={{ mr: 1, fontWeight: 'bold' }} 
                                />
                                Bảo trì
                              </MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mô tả chi tiết"
                        multiline
                        rows={4}
                        {...register('description')}
                        placeholder="Mô tả chi tiết về phòng: vị trí, tiện nghi, đặc điểm nổi bật, chính sách thuê..."
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'grey.50',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'grey.100'
                            },
                            '&.Mui-focused': {
                              bgcolor: 'white',
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'text.secondary',
                            fontWeight: 500
                          },
                          '& .MuiInputBase-input': {
                            lineHeight: 1.6
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Tab 1: Image Upload */}
              {currentTab === 1 && (
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 4, 
                    border: '2px solid',
                    borderColor: 'info.100',
                    borderRadius: 3,
                    bgcolor: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #0288d1, #29b6f6, #0288d1)',
                      backgroundSize: '200% 100%',
                      animation: 'gradient 3s ease infinite'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Box 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '50%', 
                        bgcolor: 'info.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: 2
                      }}
                    >
                      <PhotoCamera sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: 'info.main',
                          fontWeight: 'bold',
                          mb: 0.5
                        }}
                      >
                        Hình ảnh phòng
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontStyle: 'italic'
                        }}
                      >
                        Upload và quản lý hình ảnh cho phòng
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Upload Area */}
                  <Paper
                    elevation={2}
                    sx={{
                      border: '3px dashed',
                      borderColor: 'grey.300',
                      borderRadius: 3,
                      p: 4,
                      textAlign: 'center',
                      bgcolor: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: 'info.main',
                        bgcolor: 'info.50',
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <CloudUpload sx={{ fontSize: 64, color: 'info.main', mb: 2 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'info.main' }}>
                      Kéo thả ảnh vào đây
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                      hoặc click để chọn từ thiết bị
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      📷 Hỗ trợ: JPG, PNG, GIF • 📏 Tối đa 10MB mỗi ảnh • 🖼️ Không giới hạn số lượng
                    </Typography>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                  </Paper>

                  {/* New Images Preview */}
                  {imagePreview.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'success.main',
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2
                        }}
                      >
                        📸 Ảnh mới được chọn ({imagePreview.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {imagePreview.map((preview, index) => (
                          <Grid item xs={6} sm={4} md={3} key={index}>
                            <Card 
                              sx={{ 
                                position: 'relative', 
                                height: 220,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: 4
                                },
                                border: index === defaultImageIndex ? '3px solid' : '1px solid',
                                borderColor: index === defaultImageIndex ? 'warning.main' : 'grey.300'
                              }}
                            >
                              {index === defaultImageIndex && (
                                <Chip
                                  label="Mặc định"
                                  color="warning"
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    zIndex: 2,
                                    fontWeight: 'bold'
                                  }}
                                />
                              )}
                              <CardMedia
                                component="img"
                                height="150"
                                image={preview.url}
                                alt={`Preview ${index + 1}`}
                                sx={{ 
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Tooltip title={index === defaultImageIndex ? "Đã là ảnh mặc định" : "Đặt làm ảnh mặc định"}>
                                    <IconButton
                                      size="small"
                                      onClick={() => setAsDefaultImage(index)}
                                      color={index === defaultImageIndex ? "warning" : "default"}
                                      sx={{
                                        '&:hover': {
                                          bgcolor: 'warning.50',
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      {index === defaultImageIndex ? <Star /> : <StarBorder />}
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Xóa ảnh">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => removeSelectedImage(index)}
                                      sx={{
                                        '&:hover': {
                                          bgcolor: 'error.50',
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <DeleteOutline />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'info.main',
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2
                        }}
                      >
                        🖼️ Ảnh hiện có ({existingImages.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {existingImages.map((image, index) => (
                          <Grid item xs={6} sm={4} md={3} key={image.id}>
                            <Card 
                              sx={{ 
                                position: 'relative', 
                                height: 220,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: 4
                                },
                                border: image.is_default ? '3px solid' : '1px solid',
                                borderColor: image.is_default ? 'warning.main' : 'grey.300'
                              }}
                            >
                              {image.is_default && (
                                <Chip
                                  label="Mặc định"
                                  color="warning"
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    zIndex: 2,
                                    fontWeight: 'bold'
                                  }}
                                />
                              )}
                              <CardMedia
                                component="img"
                                height="150"
                                image={`http://localhost:4000${image.image_url}`}
                                alt={`Room ${index + 1}`}
                                sx={{ 
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Tooltip title={image.is_default ? "Đã là ảnh mặc định" : "Đặt làm ảnh mặc định"}>
                                    <IconButton
                                      size="small"
                                      onClick={() => setAsDefaultImage(index, true)}
                                      color={image.is_default ? "warning" : "default"}
                                      sx={{
                                        '&:hover': {
                                          bgcolor: 'warning.50',
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      {image.is_default ? <Star /> : <StarBorder />}
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Xóa ảnh">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => deleteExistingImage(image.id)}
                                      sx={{
                                        '&:hover': {
                                          bgcolor: 'error.50',
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <DeleteOutline />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Instructions */}
                  {imagePreview.length === 0 && existingImages.length === 0 && (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mt: 3,
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                          width: '100%'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        💡 <strong>Mẹo sử dụng:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        • Ảnh đầu tiên sẽ được đặt làm ảnh mặc định<br/>
                        • Click vào icon ⭐ để thay đổi ảnh mặc định<br/>
                        • Sử dụng ảnh chất lượng cao để thu hút khách thuê<br/>
                        • Nên có ít nhất 3-5 ảnh cho mỗi phòng
                      </Typography>
                    </Alert>
                  )}
                </Paper>
              )}

              {/* Tab 2: Assets Management */}
              {currentTab === 2 && (
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 4, 
                    border: '2px solid',
                    borderColor: 'success.100',
                    borderRadius: 3,
                    bgcolor: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #2e7d32, #4caf50, #2e7d32)',
                      backgroundSize: '200% 100%',
                      animation: 'gradient 3s ease infinite'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Box 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '50%', 
                        bgcolor: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: 2
                      }}
                    >
                      <Settings sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: 'success.main',
                          fontWeight: 'bold',
                          mb: 0.5
                        }}
                      >
                        Nội thất & Tài sản
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontStyle: 'italic'
                        }}
                      >
                        Chọn nội thất có sẵn hoặc thêm mới cho phòng
                      </Typography>
                    </Box>
                  </Box>

                  {/* Available Assets from Database */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                      🗄️ Tài sản có sẵn trong hệ thống
                    </Typography>
                    <Grid container spacing={2}>
                      {availableAssets.map((asset) => {
                        const isSelected = roomAssets.find(roomAsset => roomAsset.id === asset.id)
                        return (
                          <Grid item xs={12} sm={6} md={4} key={asset.id}>
                            <Card 
                              sx={{ 
                                p: 2,
                                cursor: isSelected ? 'not-allowed' : 'pointer',
                                opacity: isSelected ? 0.6 : 1,
                                border: isSelected ? '2px solid' : '1px solid',
                                borderColor: isSelected ? 'success.main' : 'grey.300',
                                bgcolor: isSelected ? 'success.50' : 'white',
                                transition: 'all 0.3s ease',
                                '&:hover': isSelected ? {} : {
                                  transform: 'translateY(-2px)',
                                  boxShadow: 3,
                                  borderColor: 'primary.main'
                                }
                              }}
                              onClick={() => !isSelected && addAssetFromDatabase(asset)}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                  {asset.name}
                                </Typography>
                                {isSelected && (
                                  <Chip label="Đã chọn" color="success" size="small" />
                                )}
                              </Box>
                                                             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                 Loại: {assetTypes.find(type => type.id === asset.asset_type_id)?.name || 'N/A'}
                               </Typography>
                               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                 Giá trị: {new Intl.NumberFormat('vi-VN').format(asset.value || 0)} VND
                               </Typography>
                               <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                 S/N: {asset.serial_number || 'Chưa có'}
                               </Typography>
                            </Card>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Box>

                                     {/* Selected Assets */}
                   <Box sx={{ mb: 3 }}>
                     <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main', mb: 2 }}>
                       📦 Tài sản đã chọn cho phòng ({roomAssets.length})
                     </Typography>
                     
                     {/* Debug info removed */}

                                         {roomAssets.length === 0 && (
                       <Alert 
                         severity="info" 
                         sx={{ 
                           borderRadius: 2,
                           bgcolor: 'info.50',
                           border: '1px solid',
                           borderColor: 'info.200'
                         }}
                       >
                         <Typography variant="body2">
                           🏠 <strong>Chưa có tài sản nào.</strong> Click vào tài sản ở trên để thêm vào phòng.
                         </Typography>
                       </Alert>
                     )}

                                           {roomAssets.length > 0 && (
                        <Alert
                          severity="success"
                          sx={{
                            borderRadius: 2,
                            bgcolor: 'success.50',
                            border: '1px solid',
                            borderColor: 'success.200',
                            mb: 2
                          }}
                        >
                          <Typography variant="body2">
                            ✅ <strong>Thành công!</strong> Tài sản đã được liên kết với phòng. Tất cả thông tin được lấy từ database.
                          </Typography>
                        </Alert>
                      )}

                    {roomAssets.map((asset, index) => {
                      // Use asset data directly from roomAssets
                      console.log('🎯 Rendering asset:', asset)
                      
                      return (
                        <Card 
                          key={asset.id} 
                          sx={{ 
                            mb: 3, 
                            p: 0,
                            border: '2px solid', 
                            borderColor: 'grey.200', 
                            borderRadius: 3,
                            bgcolor: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: 2,
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              p: 2,
                              bgcolor: 'success.50',
                              borderBottom: '1px solid',
                              borderColor: 'grey.200'
                            }}
                          >
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 'bold', 
                                color: 'success.main',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Inventory sx={{ mr: 1, fontSize: 20 }} />
                              {asset.name}
                            </Typography>
                            <Tooltip title="Xóa tài sản khỏi phòng">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => removeAsset(index)}
                                sx={{ 
                                  '&:hover': { 
                                    bgcolor: 'error.main',
                                    color: 'white',
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Close />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Box sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  <strong>Loại:</strong> {assetTypes.find(type => type.id === asset.asset_type_id)?.name || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  <strong>Số serial:</strong> {asset.serial_number || 'Chưa có'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  <strong>Giá trị:</strong> {new Intl.NumberFormat('vi-VN').format(asset.value || 0)} VND
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  <strong>Trạng thái:</strong> 
                                  <Chip 
                                    label={asset.status === 'in_use' ? 'Đang sử dụng' : 'Trong kho'} 
                                    size="small" 
                                    color={asset.status === 'in_use' ? 'success' : 'default'}
                                    sx={{ ml: 1 }}
                                  />
                                </Typography>
                              </Grid>
                              {asset.notes && (
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Ghi chú:</strong> {asset.notes}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        </Card>
                      );
                    })}
                  </Box>
                </Paper>
              )}
            </Box>
          </DialogContent>
          
          <DialogActions 
            sx={{ 
              p: 3, 
              gap: 2,
              bgcolor: 'grey.50',
              borderTop: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Button 
              onClick={() => setDialogOpen(false)}
              variant="outlined"
              size="large"
              sx={{ 
                minWidth: 140,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              size="large"
              sx={{ 
                minWidth: 140,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-1px)'
                }
              }}
              startIcon={editingRoom ? <Edit /> : <Add />}
            >
              {editingRoom ? 'Cập nhật phòng' : 'Tạo phòng mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Room Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info /> Chi tiết phòng {roomDetail?.room_number}
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
          {detailLoading ? (
            <Alert severity="info">Đang tải chi tiết phòng...</Alert>
          ) : roomDetail ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Box sx={{ position: 'relative', height: 320, borderRadius: 2, overflow: 'hidden', mb: 1 }}>
                    {roomDetail.room_images?.length ? (
                      <img
                        src={`http://localhost:4000${roomDetail.room_images[detailImageIndex]?.image_url}`}
                        alt="room"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RoomIcon sx={{ fontSize: 64, color: 'grey.400' }} />
                      </Box>
                    )}
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      {getStatusChip(roomDetail.status)}
                    </Box>
                  </Box>
                  {roomDetail.room_images?.length > 1 && (
                    <Grid container spacing={1}>
                      {roomDetail.room_images.map((img, idx) => (
                        <Grid item xs={3} key={img.id || idx}>
                          <Box
                            onClick={() => setDetailImageIndex(idx)}
                            sx={{
                              height: 64,
                              borderRadius: 1,
                              overflow: 'hidden',
                              border: idx === detailImageIndex ? '2px solid' : '1px solid',
                              borderColor: idx === detailImageIndex ? 'primary.main' : 'grey.200',
                              cursor: 'pointer'
                            }}
                          >
                            <img src={`http://localhost:4000${img.image_url}`} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Thông tin cơ bản</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Khu trọ</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{roomDetail.property?.name}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Số phòng</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{roomDetail.room_number}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Diện tích</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{roomDetail.area} m²</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Giá thuê</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{new Intl.NumberFormat('vi-VN').format(roomDetail.rent_price)} VND</Typography></Grid>
                    <Grid item xs={12}>{roomDetail.description && (<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{roomDetail.description}</Typography>)}</Grid>
                  </Grid>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'white', mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Người thuê / Hợp đồng</Typography>
                  {roomContracts.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">Chưa có hợp đồng</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {roomContracts.map(c => (
                        <Box key={c.id} sx={{ p: 1.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">HĐ #{c.id} • {c.tenant?.full_name} • {c.tenant?.phone_number}</Typography>
                            <Chip size="small" label={c.status === 'active' ? 'Đang hiệu lực' : c.status === 'expired' ? 'Hết hạn' : 'Đã chấm dứt'} color={c.status === 'active' ? 'success' : c.status === 'expired' ? 'error' : 'default'} />
                          </Stack>
                          <Typography variant="caption" color="text.secondary">Từ {new Date(c.start_date).toLocaleDateString('vi-VN')} {c.end_date ? `đến ${new Date(c.end_date).toLocaleDateString('vi-VN')}` : ''}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Nội thất/Tài sản trong phòng</Typography>
                  {roomDetail.assets?.length ? (
                    <Grid container spacing={1}>
                      {roomDetail.assets.map(a => (
                        <Grid item xs={12} sm={6} md={4} key={a.id}>
                          <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{a.asset_type?.name || 'Nội thất'} • {a.serial_number || 'S/N -'}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Chưa có tài sản liên kết</Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="warning">Không tải được chi tiết phòng</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)} variant="outlined">Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
