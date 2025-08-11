import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import api from '../../api';

export default function AssetTypeManagement() {
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/asset-types');
      setAssetTypes(response.data);
    } catch (error) {
      setError('Không thể tải danh sách loại tài sản');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAssetType(null);
    reset();
    setDialogOpen(true);
  };

  const handleEdit = (assetType) => {
    setEditingAssetType(assetType);
    reset({
      name: assetType.name
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa loại tài sản này?')) return;
    
    try {
      await api.delete(`/admin/asset-types/${id}`);
      setSuccess('Xóa loại tài sản thành công');
      loadData();
    } catch (error) {
      setError('Không thể xóa loại tài sản');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingAssetType) {
        await api.put(`/admin/asset-types/${editingAssetType.id}`, data);
        setSuccess('Cập nhật loại tài sản thành công');
      } else {
        await api.post('/admin/asset-types', data);
        setSuccess('Thêm loại tài sản thành công');
      }
      setDialogOpen(false);
      loadData();
    } catch (error) {
      setError(editingAssetType ? 'Không thể cập nhật loại tài sản' : 'Không thể thêm loại tài sản');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAssetType(null);
    reset();
  };

  // Calculate stats
  const totalAssetTypes = assetTypes.length;
  const activeAssetTypes = assetTypes.length; // All asset types are considered active

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        🏷️ Quản lý loại tài sản
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CategoryIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Tổng loại tài sản
                  </Typography>
                  <Typography variant="h4">
                    {totalAssetTypes}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InventoryIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Loại đang sử dụng
                  </Typography>
                  <Typography variant="h4">
                    {activeAssetTypes}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Tỷ lệ sử dụng
                  </Typography>
                  <Typography variant="h4">
                    {totalAssetTypes > 0 ? '100%' : '0%'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)', 
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Cần bổ sung
                  </Typography>
                  <Typography variant="h4">
                    0
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Table */}
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
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
            height: 4,
            background: 'linear-gradient(90deg, #2196F3, #21CBF3)'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            📋 Danh sách loại tài sản
          </Typography>
          <Tooltip title="Thêm loại tài sản mới">
            <Fab 
              color="primary" 
              size="medium"
              onClick={handleAdd}
              sx={{ 
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tên loại tài sản</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : assetTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="textSecondary">Chưa có loại tài sản nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                assetTypes.map((assetType) => (
                  <TableRow 
                    key={assetType.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'grey.50' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>
                      <Chip 
                        label={`#${assetType.id}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {assetType.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="Đang sử dụng" 
                        color="success" 
                        size="small"
                        icon={<InventoryIcon />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(assetType)}
                            sx={{ 
                              '&:hover': { 
                                bgcolor: 'primary.50',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(assetType.id)}
                            sx={{ 
                              '&:hover': { 
                                bgcolor: 'error.50',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          fontWeight: 'bold'
        }}>
          {editingAssetType ? '✏️ Chỉnh sửa loại tài sản' : '➕ Thêm loại tài sản mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 3 }}>
            <Controller
              name="name"
              control={control}
              rules={{ 
                required: 'Tên loại tài sản là bắt buộc',
                minLength: { value: 2, message: 'Tên phải có ít nhất 2 ký tự' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên loại tài sản"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Hủy
            </Button>
            <Button 
              type="submit"
              variant="contained"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3
              }}
            >
              {editingAssetType ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
