import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Eye,
  Trash2,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  useGetMyComplaintsQuery,
  useDeleteComplaintMutation,
  useSearchComplaintsQuery,
} from '../../features/complaints/complaintsApiSlice';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // API calls
  const {
    data: complaintsData,
    isLoading,
    error,
    refetch,
  } = useGetMyComplaintsQuery();

  const {
    data: searchData,
    isLoading: isSearching,
  } = useSearchComplaintsQuery(searchQuery, {
    skip: !searchQuery.trim(),
  });

  const [deleteComplaint, { isLoading: isDeleting }] = useDeleteComplaintMutation();

  // Get complaints data
  const complaints = searchQuery.trim() 
    ? searchData?.data || []
    : complaintsData?.data || [];

  // Filter complaints by status
  const filteredComplaints = complaints.filter(complaint => {
    if (statusFilter === 'all') return true;
    return complaint.status === statusFilter;
  });

  // Status configuration with College Mate theme
  const getStatusInfo = (status) => {
    const statusConfig = {
      pending: {
        color: 'warning',
        icon: <Clock className="w-4 h-4" />,
        gradient: 'linear-gradient(135deg, #facc15, #fb923c)',
        bgColor: 'rgba(250, 204, 21, 0.10)',
        textColor: '#facc15',
        glowColor: 'rgba(250, 204, 21, 0.20)',
      },
      'in-progress': {
        color: 'info',
        icon: <AlertCircle className="w-4 h-4" />,
        gradient: 'linear-gradient(135deg, #3b82f6, #0891b2)',
        bgColor: 'rgba(59, 130, 246, 0.10)',
        textColor: '#3b82f6',
        glowColor: 'rgba(59, 130, 246, 0.20)',
      },
      resolved: {
        color: 'success',
        icon: <CheckCircle className="w-4 h-4" />,
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        bgColor: 'rgba(16, 185, 129, 0.10)',
        textColor: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.20)',
      },
      rejected: {
        color: 'error',
        icon: <XCircle className="w-4 h-4" />,
        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        bgColor: 'rgba(239, 68, 68, 0.10)',
        textColor: '#ef4444',
        glowColor: 'rgba(239, 68, 68, 0.20)',
      },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  // Handle delete complaint
  const handleDeleteClick = (complaint) => {
    setComplaintToDelete(complaint);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (complaintToDelete) {
      try {
        await deleteComplaint(complaintToDelete._id).unwrap();
        setDeleteDialogOpen(false);
        setComplaintToDelete(null);
        refetch();
      } catch (error) {
        console.error('Failed to delete complaint:', error);
      }
    }
  };

  // Handle view details - FIXED PATH
  const handleViewDetails = (complaintId) => {
    navigate(`/student/complaints/${complaintId}`);
  };

  // Handle create new complaint - FIXED PATH
  const handleCreateComplaint = () => {
    navigate('/student/complaints/create');
  };

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  if (isLoading) {
    return (
      <Box 
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '24px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <CircularProgress 
            sx={{ 
              color: '#c084fc',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <Typography sx={{ color: '#cbd5e1', fontSize: '18px' }}>
            Loading your complaints...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.20) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, padding: '48px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <Box sx={{ marginBottom: '48px', textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: '16px',
              fontSize: { xs: '36px', md: '48px' }
            }}
          >
            My Complaints
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#cbd5e1', 
              fontSize: '20px',
              opacity: 0.9
            }}
          >
            Track and manage your submitted complaints
          </Typography>
        </Box>

        {/* Controls */}
        <Box 
          sx={{
            marginBottom: '32px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: '24px',
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '16px', flex: 1 }}>
            {/* Search */}
            <TextField
              placeholder="Search complaints..."
              variant="outlined"
              size="medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="w-5 h-5" style={{ color: '#c084fc' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: '320px',
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderRadius: '16px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(147, 51, 234, 0.30)',
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.10)',
                    borderColor: '#9333ea',
                    boxShadow: '0 0 20px rgba(147, 51, 234, 0.20)',
                  },
                  '& fieldset': {
                    border: 'none',
                  },
                  '& input::placeholder': {
                    color: '#cbd5e1',
                    opacity: 0.7,
                  }
                }
              }}
            />

            {/* Status Filter */}
            <TextField
              select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              variant="outlined"
              size="medium"
              SelectProps={{
                native: true,
              }}
              sx={{
                minWidth: '200px',
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderRadius: '16px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(147, 51, 234, 0.30)',
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.10)',
                    borderColor: '#9333ea',
                  },
                  '& fieldset': {
                    border: 'none',
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#cbd5e1',
                  '&.Mui-focused': {
                    color: '#c084fc',
                  }
                }
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Box>

          {/* Create Button */}
          <Button
            variant="contained"
            startIcon={<Plus className="w-5 h-5" />}
            onClick={handleCreateComplaint}
            sx={{
              background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
              padding: '12px 24px',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 10px 25px rgba(147, 51, 234, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: 'none',
              '&:hover': {
                transform: 'scale(1.05) translateY(-2px)',
                boxShadow: '0 20px 40px rgba(147, 51, 234, 0.35)',
                background: 'linear-gradient(90deg, #a855f7, #e11d48, #6366f1)',
              }
            }}
          >
            Create Complaint
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: '32px',
              background: 'rgba(239, 68, 68, 0.10)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239, 68, 68, 0.30)',
              borderRadius: '16px',
              color: '#ffffff',
              '& .MuiAlert-icon': {
                color: '#ef4444'
              }
            }}
          >
            Failed to load complaints. Please try again.
          </Alert>
        )}

        {/* Complaints List */}
        {isSearching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <CircularProgress size={32} sx={{ color: '#c084fc' }} />
          </Box>
        ) : filteredComplaints.length === 0 ? (
          <Card 
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '24px',
              padding: '48px',
              textAlign: 'center',
              transition: 'all 0.5s ease',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.20), rgba(79, 70, 229, 0.20))',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <AlertCircle className="w-10 h-10" style={{ color: '#c084fc' }} />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#ffffff', 
                  marginBottom: '12px',
                  fontWeight: 600 
                }}
              >
                {searchQuery.trim() || statusFilter !== 'all' 
                  ? 'No complaints found matching your criteria'
                  : 'No complaints yet'
                }
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#cbd5e1', 
                  marginBottom: '24px',
                  fontSize: '18px',
                  opacity: 0.8
                }}
              >
                {!searchQuery.trim() && statusFilter === 'all' 
                  ? 'Start by creating your first complaint'
                  : 'Try adjusting your search or filter criteria'
                }
              </Typography>
              {!searchQuery.trim() && statusFilter === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<Plus className="w-5 h-5" />}
                  onClick={handleCreateComplaint}
                  sx={{
                    background: 'linear-gradient(90deg, #9333ea, #db2777)',
                    padding: '12px 24px',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 15px 30px rgba(147, 51, 234, 0.30)',
                    }
                  }}
                >
                  Create Your First Complaint
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredComplaints.map((complaint) => {
              const statusInfo = getStatusInfo(complaint.status);
              return (
                <Grid item xs={12} key={complaint._id}>
                  <Card 
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      borderRadius: '24px',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: statusInfo.gradient,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: `1px solid ${statusInfo.textColor}40`,
                        boxShadow: `0 25px 50px -12px ${statusInfo.glowColor}`,
                      }
                    }}
                  >
                    <CardContent sx={{ padding: '32px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#ffffff', 
                              marginBottom: '8px',
                              fontSize: '22px'
                            }}
                          >
                            {complaint.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#cbd5e1', 
                              marginBottom: '12px',
                              fontSize: '16px',
                              opacity: 0.8
                            }}
                          >
                            <span style={{ color: '#c084fc', fontWeight: 500 }}>Category:</span> {complaint.category} • <span style={{ color: '#c084fc', fontWeight: 500 }}>Landmark:</span> {complaint.landmark}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: '#ffffff', 
                              lineHeight: 1.6,
                              fontSize: '16px',
                              opacity: 0.9,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {complaint.description}
                          </Typography>
                        </Box>
                        
                        <Chip
                          icon={statusInfo.icon}
                          label={complaint.status.replace('-', ' ').toUpperCase()}
                          sx={{
                            background: statusInfo.bgColor,
                            color: statusInfo.textColor,
                            border: `1px solid ${statusInfo.textColor}30`,
                            fontWeight: 600,
                            fontSize: '12px',
                            padding: '8px 4px',
                            backdropFilter: 'blur(8px)',
                            '& .MuiChip-icon': {
                              color: statusInfo.textColor,
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#cbd5e1',
                            fontSize: '14px',
                            opacity: 0.7
                          }}
                        >
                          Created: {new Date(complaint.createdAt).toLocaleDateString()}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={() => handleViewDetails(complaint._id)}
                              size="small"
                              sx={{
                                background: 'rgba(59, 130, 246, 0.10)',
                                border: '1px solid rgba(59, 130, 246, 0.30)',
                                color: '#3b82f6',
                                width: '40px',
                                height: '40px',
                                backdropFilter: 'blur(8px)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: 'rgba(59, 130, 246, 0.20)',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.25)',
                                }
                              }}
                            >
                              <Eye className="w-5 h-5" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete Complaint">
                            <IconButton
                              onClick={() => handleDeleteClick(complaint)}
                              size="small"
                              sx={{
                                background: 'rgba(239, 68, 68, 0.10)',
                                border: '1px solid rgba(239, 68, 68, 0.30)',
                                color: '#ef4444',
                                width: '40px',
                                height: '40px',
                                backdropFilter: 'blur(8px)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: 'rgba(239, 68, 68, 0.20)',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.25)',
                                }
                              }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '24px',
              color: '#ffffff',
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 600,
              borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
            }}
          >
            Delete Complaint
          </DialogTitle>
          <DialogContent sx={{ padding: '24px' }}>
            <Typography sx={{ color: '#cbd5e1', fontSize: '16px', lineHeight: 1.6 }}>
              Are you sure you want to delete <span style={{ color: '#c084fc', fontWeight: 600 }}>"{complaintToDelete?.title}"</span>? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: '24px', gap: '12px' }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                background: 'rgba(255, 255, 255, 0.10)',
                color: '#cbd5e1',
                padding: '8px 20px',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '16px',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={16} sx={{ color: '#ffffff' }} /> : <Trash2 className="w-4 h-4" />}
              sx={{
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.25)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 30px rgba(239, 68, 68, 0.35)',
                },
                '&:disabled': {
                  opacity: 0.7,
                  transform: 'none',
                }
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MyComplaints;