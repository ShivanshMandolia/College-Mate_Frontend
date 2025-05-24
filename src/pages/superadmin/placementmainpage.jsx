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
      <div className="min-h-screen bg-slate-900 bg-opacity-95 p-6">
        <div className="flex justify-center items-center h-96">
          <div className="glass-card p-8 rounded-3xl">
            <CircularProgress sx={{ color: '#a855f7' }} size={40} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-900 bg-opacity-95 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-6 rounded-2xl border border-red-500/20">
            <Alert 
              severity="error" 
              sx={{ 
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ffffff',
                '& .MuiAlert-icon': { color: '#ef4444' }
              }}
            >
              Error loading placements: {error?.data?.message || 'Something went wrong'}
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
    }}>
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-20 animate-pulse"
             style={{ background: 'linear-gradient(135deg, #9333ea, #db2777)' }}></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full opacity-10 animate-pulse delay-1000"
             style={{ background: 'linear-gradient(135deg, #4f46e5, #3b82f6)' }}></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 rounded-full opacity-10 animate-pulse delay-2000"
             style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl"
               style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4"
                    style={{
                      background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}>
                  Manage Placements
                </h1>
                <p className="text-slate-300 text-lg">
                  Monitor and manage all placement opportunities
                </p>
              </div>
              
              <button
                onClick={handleCreatePlacement}
                className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 25px 50px -12px rgba(147, 51, 234, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
                }}
              >
                <div className="flex items-center gap-3">
                  <PlusCircle size={20} />
                  Create Placement
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {(!data || data.data.length === 0) ? (
          <div className="glass-card p-16 rounded-3xl border border-white/10 backdrop-blur-xl text-center"
               style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #a855f7, #4f46e5)' }}>
              <BookOpen size={32} className="text-white" />
            </div>
            <Typography variant="h5" className="text-white font-semibold mb-2">
              No placements found
            </Typography>
            <Typography variant="body1" className="text-slate-300">
              Create your first placement to get started!
            </Typography>
          </div>
        ) : (
          <Grid container spacing={4}>
            {data.data.map((placement, index) => (
              <Grid item xs={12} sm={6} lg={4} key={placement._id}>
                <div 
                  className="group relative h-full rounded-3xl border transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.10)',
                    animationDelay: `${index * 100}ms`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                    e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.50)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(147, 51, 234, 0.10)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Delete Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => handleDeleteClick(placement)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3"
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>

                  <div className="p-6">
                    {/* Status Chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-xl text-sm font-medium ${
                        placement.status === "open" 
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}>
                        {placement.status === "open" ? "Open" : "Closed"}
                      </span>
                      
                      {placement.selectedStudents?.length > 0 && (
                        <span className="px-3 py-1 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {placement.selectedStudents.length} shortlisted
                        </span>
                      )}
                    </div>

                    {/* Company Name */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      {placement.companyName}
                    </h3>

                    {/* Job Title */}
                    <h4 className="text-lg font-semibold mb-4"
                        style={{
                          background: 'linear-gradient(90deg, #a855f7, #4f46e5)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent'
                        }}>
                      {placement.jobTitle}
                    </h4>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0"
                             style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                          <Building size={14} className="text-white" />
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {placement.eligibilityCriteria || 'No criteria specified'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                             style={{ background: 'linear-gradient(135deg, #6366f1, #2563eb)' }}>
                          <Calendar size={14} className="text-white" />
                        </div>
                        <p className="text-slate-300 text-sm">
                          Deadline: {placement.deadline ? formatDate(placement.deadline) : 'Not set'}
                        </p>
                      </div>

                      {placement.assignedAdmin && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                               style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}>
                            <User size={14} className="text-white" />
                          </div>
                          <p className="text-slate-300 text-sm">
                            Admin assigned
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={confirmDelete}
          onClose={handleCancelDelete}
          PaperProps={{
            sx: {
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: '#ffffff'
            }
          }}
        >
          <DialogTitle sx={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6 }}>
              Are you sure you want to delete the placement for{' '}
              <span className="font-semibold text-purple-400">
                {placementToDelete?.companyName}
              </span>
              ? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <button
              onClick={handleCancelDelete}
              className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white transition-colors duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              style={{
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3)'
              }}
            >
              {isDeleting ? (
                <>
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete
                </>
              )}
            </button>
          </DialogActions>
        </Dialog>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.10);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PlacementList;