import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetAllPlacementsForAdminQuery, 
  useDeletePlacementMutation 
} from '../../features/placements/placementsApiSlice';
import { selectAllPlacements } from '../../features/placements/placementsSlice';
import { PlusCircle, Trash2, BookOpen, Building, Calendar, User } from 'lucide-react';
import { 
  Card, 
  CardContent,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert
} from '@mui/material';

const PlacementList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const placements = useSelector(selectAllPlacements);
  
  const { data, isLoading, isError, error, refetch } = useGetAllPlacementsForAdminQuery();
  const [deletePlacement, { isLoading: isDeleting }] = useDeletePlacementMutation();
  
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [placementToDelete, setPlacementToDelete] = React.useState(null);
  
  useEffect(() => {
    // Data is automatically loaded and cached by RTK Query
  }, []);
  
  const handleCreatePlacement = () => {
     navigate('/superadmin/create');
  };
  
  const handleDeleteClick = (placement) => {
    setPlacementToDelete(placement);
    setConfirmDelete(true);
  };
  
  const handleConfirmDelete = async () => {
    if (placementToDelete?._id) {
      try {
        await deletePlacement(placementToDelete._id).unwrap();
        setConfirmDelete(false);
        setPlacementToDelete(null);
      } catch (err) {
        console.error('Failed to delete placement:', err);
      }
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setPlacementToDelete(null);
  };
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading placements: {error?.data?.message || 'Something went wrong'}
        </Alert>
      </Box>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Placements
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PlusCircle size={20} />}
          onClick={handleCreatePlacement}
        >
          Create Placement
        </Button>
      </Box>

      {(!data || data.data.length === 0) ? (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No placements found. Create your first placement!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {data.data.map((placement) => (
            <Grid item xs={12} sm={6} md={4} key={placement._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
                className="relative"
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteClick(placement)}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={placement.status === "open" ? "Open" : "Closed"} 
                      color={placement.status === "open" ? "success" : "default"}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {placement.selectedStudents?.length > 0 && (
                      <Chip 
                        label={`${placement.selectedStudents.length} shortlisted`}
                        color="info"
                        size="small"
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {placement.companyName}
                  </Typography>
                  
                  <Typography variant="subtitle1" color="primary" gutterBottom noWrap>
                    {placement.jobTitle}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Building size={16} className="mr-2 text-gray-500" />
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {placement.eligibilityCriteria || 'No criteria specified'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <Typography variant="body2" color="textSecondary">
                      Deadline: {placement.deadline ? formatDate(placement.deadline) : 'Not set'}
                    </Typography>
                  </Box>
                  
                  {placement.assignedAdmin && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <User size={16} className="mr-2 text-gray-500" />
                      <Typography variant="body2" color="textSecondary">
                        Admin assigned
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
               
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the placement for {placementToDelete?.companyName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : <Trash2 size={16} />}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlacementList;