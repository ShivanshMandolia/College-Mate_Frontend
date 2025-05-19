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
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200',
      },
      'in-progress': {
        color: 'info',
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
      },
      resolved: {
        color: 'success',
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
      },
      rejected: {
        color: 'error',
        icon: <XCircle className="w-4 h-4" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
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
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box className="p-6 max-w-3xl mx-auto">
        <Alert severity="error" className="mb-4">
          Failed to load complaint details. Please try again.
        </Alert>
        <Button
          startIcon={<ArrowLeft className="w-5 h-5" />}
          variant="outlined"
          onClick={() => navigate('/student/complaints')}
        >
          Back to Complaints
        </Button>
      </Box>
    );
  }

  // Render if complaint not found
  if (!complaint) {
    return (
      <Box className="p-6 max-w-3xl mx-auto">
        <Alert severity="warning" className="mb-4">
          Complaint not found.
        </Alert>
        <Button
          startIcon={<ArrowLeft className="w-5 h-5" />}
          variant="outlined"
          onClick={() => navigate('/student/complaints')}
        >
          Back to Complaints
        </Button>
      </Box>
    );
  }

  // Get status info
  const statusInfo = getStatusInfo(complaint.status);

  return (
    <Box className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button
        startIcon={<ArrowLeft className="w-5 h-5" />}
        variant="text"
        onClick={() => navigate('/student/complaints')}
        className="mb-4 text-gray-600 hover:text-gray-800"
      >
        Back to Complaints
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card className="shadow-md">
            {/* Header */}
            <CardContent className="p-6 pb-4">
              <Box className="flex justify-between items-start">
                <Box className="flex-1">
                  <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                    {complaint.title}
                  </Typography>
                  <Box className="flex flex-wrap gap-2 items-center mb-1">
                    <Chip
                      icon={<Tag className="w-3.5 h-3.5" />}
                      label={complaint.category}
                      variant="outlined"
                      size="small"
                      className="bg-gray-100"
                    />
                    <Typography variant="body2" className="text-gray-500 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {complaint.landmark}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={statusInfo.icon}
                  label={complaint.status.replace('-', ' ').toUpperCase()}
                  variant="outlined"
                  className={`${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} border font-medium`}
                />
              </Box>
            </CardContent>

            <Divider />

            {/* Description */}
            <CardContent className="p-6">
              <Typography variant="h6" className="font-semibold mb-3">
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {complaint.description}
              </Typography>

              {/* Image */}
              {complaint.imageUrl && (
                <Box className="mt-4">
                  <Typography variant="h6" className="font-semibold mb-3">
                    Attached Image
                  </Typography>
                  <Box 
                    className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
                    onClick={() => setImageModalOpen(true)}
                  >
                    <img 
                      src={complaint.imageUrl} 
                      alt="Complaint" 
                      className="w-full max-h-96 object-contain bg-gray-100"
                    />
                    <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-10 h-10 text-white" />
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
          <Paper className="p-4 mb-4 shadow-md">
            <Typography variant="h6" className="font-semibold mb-3">
              Actions
            </Typography>
            <Button
              startIcon={<Trash2 className="w-5 h-5" />}
              variant="contained"
              color="error"
              fullWidth
              onClick={handleDeleteClick}
              className="mb-2"
            >
              Delete Complaint
            </Button>
          </Paper>

          {/* Complaint Info */}
          <Paper className="p-4 shadow-md">
            <Typography variant="h6" className="font-semibold mb-3">
              Complaint Details
            </Typography>
            
            <Box className="space-y-4">
              {/* Dates */}
              <Box>
                <Typography variant="subtitle2" className="text-gray-500 flex items-center mb-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {formatDate(complaint.createdAt)}
                </Typography>
              </Box>

              {/* Created By */}
              <Box>
                <Typography variant="subtitle2" className="text-gray-500 flex items-center mb-1">
                  <UserCircle className="w-4 h-4 mr-1" />
                  Created By
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {complaint.createdBy?.name || complaint.createdBy?.email || 'You'}
                </Typography>
              </Box>

              {/* Assigned To (if applicable) */}
              {complaint.assignedTo && (
                <Box>
                  <Typography variant="subtitle2" className="text-gray-500 flex items-center mb-1">
                    <UserCircle className="w-4 h-4 mr-1" />
                    Assigned To
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {complaint.assignedTo?.name || complaint.assignedTo?.email || 'Not assigned'}
                  </Typography>
                </Box>
              )}

              {/* Last Updated */}
              <Box>
                <Typography variant="subtitle2" className="text-gray-500 flex items-center mb-1">
                  <EditIcon className="w-4 h-4 mr-1" />
                  Last Updated
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {formatDate(complaint.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Complaint</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this complaint? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : <Trash2 className="w-4 h-4" />}
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
      >
        <DialogContent className="p-1">
          <img 
            src={complaint.imageUrl} 
            alt="Complaint" 
            className="w-full max-h-[80vh] object-contain"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageModalOpen(false)}>Close</Button>
          <Button 
            component="a" 
            href={complaint.imageUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            color="primary"
          >
            Open Original
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComplaintDetail;