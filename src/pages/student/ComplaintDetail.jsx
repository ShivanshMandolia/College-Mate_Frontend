import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Trash2,
  Image as ImageIcon,
  UserCircle,
  Edit as EditIcon,
  Tag,
} from 'lucide-react';
import {
  useGetComplaintByIdQuery,
  useDeleteComplaintMutation,
} from '../../features/complaints/complaintsApiSlice';

const ComplaintDetail = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // API calls
  const {
    data: complaintData,
    isLoading,
    error,
  } = useGetComplaintByIdQuery(complaintId);

  const [deleteComplaint, { isLoading: isDeleting }] = useDeleteComplaintMutation();

  const complaint = complaintData?.data || null;

  // Status configuration
  const getStatusInfo = (status) => {
    const statusConfig = {
      pending: {
        color: 'warning',
        icon: <Clock className="w-4 h-4" />,
        bgGradient: 'linear-gradient(135deg, #fb923c, #facc15)',
        textColor: '#ffffff',
        shadowColor: 'rgba(251, 146, 60, 0.25)',
      },
      'in-progress': {
        color: 'info',
        icon: <AlertCircle className="w-4 h-4" />,
        bgGradient: 'linear-gradient(135deg, #6366f1, #2563eb)',
        textColor: '#ffffff',
        shadowColor: 'rgba(99, 102, 241, 0.25)',
      },
      resolved: {
        color: 'success',
        icon: <CheckCircle className="w-4 h-4" />,
        bgGradient: 'linear-gradient(135deg, #10b981, #059669)',
        textColor: '#ffffff',
        shadowColor: 'rgba(16, 185, 129, 0.25)',
      },
      rejected: {
        color: 'error',
        icon: <XCircle className="w-4 h-4" />,
        bgGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        textColor: '#ffffff',
        shadowColor: 'rgba(239, 68, 68, 0.25)',
      },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  // Format date helper
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle delete complaint
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteComplaint(complaintId).unwrap();
      setDeleteDialogOpen(false);
      navigate('/student/complaints');
    } catch (error) {
      console.error('Failed to delete complaint:', error);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Box 
        className="flex justify-center items-center min-h-screen"
        sx={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
          minHeight: '100vh'
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '24px',
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          <CircularProgress 
            sx={{ 
              color: '#a855f7',
              '& .MuiCircularProgress-circle': {
                filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))'
              }
            }} 
            size={48}
          />
          <Typography sx={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 500 }}>
            Loading complaint details...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box 
        className="p-6 max-w-3xl mx-auto"
        sx={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
          minHeight: '100vh',
          padding: '48px 24px'
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(239, 68, 68, 0.30)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '24px'
          }}
        >
          <Alert 
            severity="error" 
            className="mb-4"
            sx={{
              background: 'rgba(239, 68, 68, 0.10)',
              border: '1px solid rgba(239, 68, 68, 0.20)',
              borderRadius: '16px',
              color: '#ffffff',
              '& .MuiAlert-icon': {
                color: '#ef4444'
              }
            }}
          >
            Failed to load complaint details. Please try again.
          </Alert>
          <Button
            startIcon={<ArrowLeft className="w-5 h-5" />}
            variant="outlined"
            onClick={() => navigate('/student/complaints')}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              borderRadius: '16px',
              color: '#ffffff',
              padding: '12px 24px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.10)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.20)'
              }
            }}
          >
            Back to Complaints
          </Button>
        </Box>
      </Box>
    );
  }

  // Render if complaint not found
  if (!complaint) {
    return (
      <Box 
        className="p-6 max-w-3xl mx-auto"
        sx={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
          minHeight: '100vh',
          padding: '48px 24px'
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(251, 146, 60, 0.30)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '24px'
          }}
        >
          <Alert 
            severity="warning" 
            className="mb-4"
            sx={{
              background: 'rgba(251, 146, 60, 0.10)',
              border: '1px solid rgba(251, 146, 60, 0.20)',
              borderRadius: '16px',
              color: '#ffffff',
              '& .MuiAlert-icon': {
                color: '#fb923c'
              }
            }}
          >
            Complaint not found.
          </Alert>
          <Button
            startIcon={<ArrowLeft className="w-5 h-5" />}
            variant="outlined"
            onClick={() => navigate('/student/complaints')}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              borderRadius: '16px',
              color: '#ffffff',
              padding: '12px 24px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.10)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.20)'
              }
            }}
          >
            Back to Complaints
          </Button>
        </Box>
      </Box>
    );
  }

  // Get status info
  const statusInfo = getStatusInfo(complaint.status);

  return (
    <Box 
      className="p-6 max-w-4xl mx-auto"
      sx={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
        minHeight: '100vh',
        minWidth:'100%',
        padding: '48px 24px'
      }}
    >
      {/* Back Button */}
      <Button
        startIcon={<ArrowLeft className="w-5 h-5" />}
        variant="text"
        onClick={() => navigate('/student/complaints')}
        className="mb-4"
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderRadius: '16px',
          color: '#cbd5e1',
          padding: '12px 20px',
          marginBottom: '32px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.10)',
            color: '#ffffff',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.15)'
          }
        }}
      >
        Back to Complaints
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card 
            className="shadow-md"
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                border: '1px solid rgba(168, 85, 247, 0.30)',
                boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.15)'
              }
            }}
          >
            {/* Header */}
            <CardContent className="p-6 pb-4">
              <Box className="flex justify-between items-start">
                <Box className="flex-1">
                  <Typography 
                    variant="h4" 
                    className="font-bold mb-2"
                    sx={{
                      background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontSize: '32px',
                      fontWeight: 700,
                      lineHeight: 1.2
                    }}
                  >
                    {complaint.title}
                  </Typography>
                  <Box className="flex flex-wrap gap-2 items-center mb-1">
                    <Chip
                      icon={<Tag className="w-3.5 h-3.5" />}
                      label={complaint.category}
                      variant="outlined"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                        border: '1px solid rgba(168, 85, 247, 0.30)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: '#ffffff'
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      className="flex items-center"
                      sx={{
                        color: '#cbd5e1',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                      {complaint.landmark}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={statusInfo.icon}
                  label={complaint.status.replace('-', ' ').toUpperCase()}
                  variant="outlined"
                  sx={{
                    background: statusInfo.bgGradient,
                    border: 'none',
                    borderRadius: '16px',
                    color: statusInfo.textColor,
                    fontWeight: 600,
                    fontSize: '12px',
                    padding: '8px 4px',
                    boxShadow: `0 8px 16px -4px ${statusInfo.shadowColor}`,
                    '& .MuiChip-icon': {
                      color: statusInfo.textColor
                    }
                  }}
                />
              </Box>
            </CardContent>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.10)' }} />

            {/* Description */}
            <CardContent className="p-6">
              <Typography 
                variant="h6" 
                className="font-semibold mb-3"
                sx={{
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: 600,
                  marginBottom: '16px'
                }}
              >
                Description
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{
                  color: '#cbd5e1',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  marginBottom: '24px'
                }}
              >
                {complaint.description}
              </Typography>

              {/* Image */}
              {complaint.imageUrl && (
                <Box className="mt-4">
                  <Typography 
                    variant="h6" 
                    className="font-semibold mb-3"
                    sx={{
                      color: '#ffffff',
                      fontSize: '20px',
                      fontWeight: 600,
                      marginBottom: '16px'
                    }}
                  >
                    Attached Image
                  </Typography>
                  <Box 
                    className="relative rounded-lg overflow-hidden cursor-pointer transition-opacity"
                    onClick={() => setImageModalOpen(true)}
                    sx={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 20px 25px -5px rgba(168, 85, 247, 0.15)'
                      }
                    }}
                  >
                    <img 
                      src={complaint.imageUrl} 
                      alt="Complaint" 
                      className="w-full max-h-96 object-contain"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                      }}
                    />
                    <Box 
                      className="absolute inset-0 flex items-center justify-center transition-opacity"
                      sx={{
                        background: 'rgba(0, 0, 0, 0.30)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      <ImageIcon 
                        className="w-10 h-10" 
                        style={{ color: '#ffffff' }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Actions */}
          <Paper 
            className="p-4 mb-4 shadow-md"
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '24px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.20)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                border: '1px solid rgba(239, 68, 68, 0.30)',
                boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.15)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              className="font-semibold mb-3"
              sx={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '16px'
              }}
            >
              Actions
            </Typography>
            <Button
              startIcon={<Trash2 className="w-5 h-5" />}
              variant="contained"
              color="error"
              fullWidth
              onClick={handleDeleteClick}
              className="mb-2"
              sx={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '16px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.30)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  transform: 'scale(1.02) translateY(-2px)',
                  boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.40)'
                }
              }}
            >
              Delete Complaint
            </Button>
          </Paper>

          {/* Complaint Info */}
          <Paper 
            className="p-4 shadow-md"
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.20)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                border: '1px solid rgba(168, 85, 247, 0.30)',
                boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.15)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              className="font-semibold mb-3"
              sx={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '24px'
              }}
            >
              Complaint Details
            </Typography>
            
            <Box className="space-y-4" sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Dates */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  className="flex items-center mb-1"
                  sx={{
                    color: '#cbd5e1',
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px'
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  Created
                </Typography>
                <Typography 
                  variant="body2" 
                  className="font-medium"
                  sx={{
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  {formatDate(complaint.createdAt)}
                </Typography>
              </Box>

              {/* Created By */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  className="flex items-center mb-1"
                  sx={{
                    color: '#cbd5e1',
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px'
                  }}
                >
                  <UserCircle className="w-4 h-4" />
                  Created By
                </Typography>
                <Typography 
                  variant="body2" 
                  className="font-medium"
                  sx={{
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  {complaint.createdBy?.name || complaint.createdBy?.email || 'You'}
                </Typography>
              </Box>

              {/* Assigned To (if applicable) */}
              {complaint.assignedTo && (
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    className="flex items-center mb-1"
                    sx={{
                      color: '#cbd5e1',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '6px'
                    }}
                  >
                    <UserCircle className="w-4 h-4" />
                    Assigned To
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className="font-medium"
                    sx={{
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 500
                    }}
                  >
                    {complaint.assignedTo?.name || complaint.assignedTo?.email || 'Not assigned'}
                  </Typography>
                </Box>
              )}

              {/* Last Updated */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  className="flex items-center mb-1"
                  sx={{
                    color: '#cbd5e1',
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px'
                  }}
                >
                  <EditIcon className="w-4 h-4" />
                  Last Updated
                </Typography>
                <Typography 
                  variant="body2" 
                  className="font-medium"
                  sx={{
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  {formatDate(complaint.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

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
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.50)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffffff', fontSize: '20px', fontWeight: 600 }}>
          Delete Complaint
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#cbd5e1', fontSize: '16px', lineHeight: 1.5 }}>
            Are you sure you want to delete this complaint? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px 24px' }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              borderRadius: '12px',
              color: '#cbd5e1',
              padding: '8px 20px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.10)',
                color: '#ffffff'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : <Trash2 className="w-4 h-4" />}
            sx={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '12px',
              padding: '8px 20px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.30)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                transform: 'translateY(-1px)',
                boxShadow: '0 12px 20px -4px rgba(239, 68, 68, 0.40)'
              }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Modal */}
      <Dialog 
        open={imageModalOpen} 
        onClose={() => setImageModalOpen(false)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.50)'
          }
        }}
      >
        <DialogContent className="p-1" sx={{ padding: '8px' }}>
          <img 
            src={complaint.imageUrl} 
            alt="Complaint" 
            className="w-full max-h-[80vh] object-contain"
            style={{
              borderRadius: '16px'
            }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px 24px' }}>
          <Button 
            onClick={() => setImageModalOpen(false)}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              borderRadius: '12px',
              color: '#cbd5e1',
              padding: '8px 20px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.10)',
                color: '#ffffff'
              }
            }}
          >
            Close
          </Button>
          <Button 
            component="a" 
            href={complaint.imageUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{
              background: 'linear-gradient(135deg, #9333ea, #db2777, #4f46e5)',
              borderRadius: '12px',
              color: '#ffffff',
              padding: '8px 20px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 16px -4px rgba(147, 51, 234, 0.30)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed, #be185d, #3730a3)',
                transform: 'translateY(-1px)',
                boxShadow: '0 12px 20px -4px rgba(147, 51, 234, 0.40)'
              }
            }}
          >
            Open Original
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComplaintDetail;