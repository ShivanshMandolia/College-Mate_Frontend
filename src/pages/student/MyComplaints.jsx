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

  // Status configuration
  const getStatusInfo = (status) => {
    const statusConfig = {
      pending: {
        color: 'warning',
        icon: <Clock className="w-4 h-4" />,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
      },
      'in-progress': {
        color: 'info',
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      },
      resolved: {
        color: 'success',
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      },
      rejected: {
        color: 'error',
        icon: <XCircle className="w-4 h-4" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
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
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <Box className="mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          My Complaints
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Track and manage your submitted complaints
        </Typography>
      </Box>

      {/* Controls */}
      <Box className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <Box className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <TextField
            placeholder="Search complaints..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-5 h-5 text-gray-400" />
                </InputAdornment>
              ),
            }}
            className="min-w-80"
          />

          {/* Status Filter */}
          <TextField
            select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            variant="outlined"
            size="small"
            SelectProps={{
              native: true,
            }}
            className="min-w-48"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
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
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Complaint
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" className="mb-6">
          Failed to load complaints. Please try again.
        </Alert>
      )}

      {/* Complaints List */}
      {isSearching ? (
        <Box className="flex justify-center py-8">
          <CircularProgress size={24} />
        </Box>
      ) : filteredComplaints.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-600 mb-2">
              {searchQuery.trim() || statusFilter !== 'all' 
                ? 'No complaints found matching your criteria'
                : 'No complaints yet'
              }
            </Typography>
            <Typography variant="body2" className="text-gray-500 mb-4">
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
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <Box className="flex items-center justify-between">
                      <Box className="flex-1">
                        <Box className="flex items-start justify-between mb-3">
                          <Box>
                            <Typography variant="h6" className="font-semibold text-gray-800 mb-1">
                              {complaint.title}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600 mb-2">
                              Category: {complaint.category} • Landmark: {complaint.landmark}
                            </Typography>
                            <Typography variant="body2" className="text-gray-700 line-clamp-2">
                              {complaint.description}
                            </Typography>
                          </Box>
                          <Chip
                            icon={statusInfo.icon}
                            label={complaint.status.replace('-', ' ').toUpperCase()}
                            variant="outlined"
                            className={`${statusInfo.bgColor} ${statusInfo.textColor} border-0 font-medium`}
                          />
                        </Box>

                        <Box className="flex items-center justify-between">
                          <Typography variant="caption" className="text-gray-500">
                            Created: {new Date(complaint.createdAt).toLocaleDateString()}
                          </Typography>
                          
                          <Box className="flex gap-2">
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => handleViewDetails(complaint._id)}
                                size="small"
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="w-5 h-5" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Delete Complaint">
                              <IconButton
                                onClick={() => handleDeleteClick(complaint)}
                                size="small"
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-5 h-5" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
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
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Complaint</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{complaintToDelete?.title}"? This action cannot be undone.
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
    </Box>
  );
};

export default MyComplaints;