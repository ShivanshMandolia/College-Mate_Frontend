import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetComplaintByIdQuery,
  useUpdateComplaintStatusMutation
} from '../../features/complaints/complaintsApiSlice';
import { setSelectedComplaint } from '../../features/complaints/complaintsSlice';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Tag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Loader2,
  ExternalLink
} from 'lucide-react';

const AdminComplaintDetail = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const selectedComplaint = useSelector(state => state.complaints.selectedComplaint);
  
  // Fetch complaint details if not already in state
  const { 
    data: complaintData, 
    isLoading, 
    isError, 
    error 
  } = useGetComplaintByIdQuery(complaintId, {
    skip: !!selectedComplaint && selectedComplaint._id === complaintId
  });
  
  // Status update mutation
  const [
    updateStatus, 
    { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError }
  ] = useUpdateComplaintStatusMutation();
  
  // Use either the cached complaint or fetched data
  const complaint = selectedComplaint?._id === complaintId 
    ? selectedComplaint 
    : complaintData;
  
  // Set complaint in redux when fetched
  useEffect(() => {
    if (complaintData && !selectedComplaint) {
      dispatch(setSelectedComplaint(complaintData));
    }
  }, [complaintData, dispatch, selectedComplaint]);
  
  // Status update handler
  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus({ 
        complaintId,
        status: newStatus 
      }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };
  
  // Format date in a readable way
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center p-8 rounded-3xl" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.10)'
          }}>
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
            <span className="ml-3 text-slate-300 text-lg">Loading complaint details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center p-8 rounded-3xl" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.5)'
          }}>
            <AlertCircle className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-red-300 font-semibold text-lg">Error loading complaint details</h3>
              <p className="text-red-400 mt-1">{error?.data?.message || 'Something went wrong'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center p-8 rounded-3xl" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(251, 191, 36, 0.5)'
          }}>
            <AlertCircle className="h-8 w-8 text-yellow-400" />
            <div className="ml-4">
              <h3 className="text-yellow-300 font-semibold text-lg">Complaint not found</h3>
              <p className="text-yellow-400 mt-1">The requested complaint could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/admin/complaints')}
            className="group flex items-center p-3 rounded-2xl transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.10)';
              e.target.style.border = '1px solid rgba(168, 85, 247, 0.50)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.border = '1px solid rgba(255, 255, 255, 0.10)';
            }}
          >
            <ArrowLeft className="h-5 w-5 mr-2 text-purple-400 group-hover:text-white transition-colors" />
            <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
              Back to complaints
            </span>
          </button>
        </div>
        
        {/* Main Complaint Card */}
        <div className="rounded-3xl p-8 transition-all duration-500" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.10)'
        }}>
          {/* Complaint Header */}
          <div className="border-b border-white/10 pb-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  {complaint.title}
                </h1>
                <div className="flex items-center mt-3">
                  <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                  <span className="text-slate-300 text-lg">
                    Submitted on {formatDate(complaint.createdAt)}
                  </span>
                </div>
              </div>
              <div className="mt-6 lg:mt-0">
                {getStatusBadge(complaint.status)}
              </div>
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="xl:col-span-2 space-y-8">
              {/* Description */}
              <div className="p-6 rounded-2xl" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
                  Description
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>
              
              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-105" style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.10), rgba(79, 70, 229, 0.10))',
                  border: '1px solid rgba(168, 85, 247, 0.20)'
                }}>
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
                      <Tag className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-3 text-purple-300 font-medium">Category</span>
                  </div>
                  <p className="font-semibold text-white text-lg">{complaint.category}</p>
                </div>
                
                <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-105" style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.10), rgba(8, 145, 178, 0.10))',
                  border: '1px solid rgba(59, 130, 246, 0.20)'
                }}>
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-3 text-blue-300 font-medium">Landmark</span>
                  </div>
                  <p className="font-semibold text-white text-lg">{complaint.landmark}</p>
                </div>
                
                <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-105 md:col-span-2" style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.10), rgba(168, 85, 247, 0.10))',
                  border: '1px solid rgba(139, 92, 246, 0.20)'
                }}>
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-3 text-violet-300 font-medium">Submitted By</span>
                  </div>
                  <p className="font-semibold text-white text-lg">
                    {complaint.createdBy?.email || 'Unknown User'}
                  </p>
                </div>
              </div>
              
              {/* Status Update Section */}
              <div className="p-6 rounded-2xl" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}>
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-full mr-3"></div>
                  Update Status
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleStatusChange('pending')}
                    disabled={complaint.status === 'pending' || isUpdating}
                    className={`flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      complaint.status === 'pending' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white cursor-default shadow-lg' 
                        : 'hover:scale-105 hover:shadow-xl'
                    }`}
                    style={complaint.status !== 'pending' ? {
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(251, 191, 36, 0.30)',
                      color: '#facc15'
                    } : {}}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    Mark as Pending
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    disabled={complaint.status === 'in-progress' || isUpdating}
                    className={`flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      complaint.status === 'in-progress' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-default shadow-lg' 
                        : 'hover:scale-105 hover:shadow-xl'
                    }`}
                    style={complaint.status !== 'in-progress' ? {
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(59, 130, 246, 0.30)',
                      color: '#60a5fa'
                    } : {}}
                  >
                    <Loader2 className={`h-5 w-5 mr-2 ${complaint.status === 'in-progress' ? 'animate-spin' : ''}`} />
                    Mark as In Progress
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    disabled={complaint.status === 'resolved' || isUpdating}
                    className={`flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      complaint.status === 'resolved' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default shadow-lg' 
                        : 'hover:scale-105 hover:shadow-xl'
                    }`}
                    style={complaint.status !== 'resolved' ? {
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(34, 197, 94, 0.30)',
                      color: '#4ade80'
                    } : {}}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Resolved
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('rejected')}
                    disabled={complaint.status === 'rejected' || isUpdating}
                    className={`flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      complaint.status === 'rejected' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white cursor-default shadow-lg' 
                        : 'hover:scale-105 hover:shadow-xl'
                    }`}
                    style={complaint.status !== 'rejected' ? {
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(239, 68, 68, 0.30)',
                      color: '#f87171'
                    } : {}}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Mark as Rejected
                  </button>
                </div>
                
                {/* Status Messages */}
                {isUpdating && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-blue-300 flex items-center">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Updating status...
                    </p>
                  </div>
                )}
                
                {isUpdateSuccess && (
                  <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-green-300 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Status updated successfully
                    </p>
                  </div>
                )}
                
                {updateError && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-300 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {updateError?.data?.message || 'Failed to update status'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column: Image */}
            <div className="space-y-6">
              {complaint.imageUrl && (
                <div className="p-6 rounded-2xl" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.10)'
                }}>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-violet-400 rounded-full mr-3"></div>
                    Attachment
                  </h2>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img 
                      src={complaint.imageUrl} 
                      alt="Complaint attachment" 
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-4" style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.10)'
                    }}>
                      <a 
                        href={complaint.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-400 hover:text-white transition-colors font-medium"
                      >
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Open full image
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status badge
const getStatusBadge = (status) => {
  const baseClasses = "flex items-center px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg";
  
  switch (status) {
    case 'pending':
      return (
        <span className={`${baseClasses} bg-gradient-to-r from-yellow-500 to-orange-500 text-white`}>
          <Clock className="h-5 w-5 mr-2" />
          Pending
        </span>
      );
    case 'in-progress':
      return (
        <span className={`${baseClasses} bg-gradient-to-r from-blue-500 to-indigo-500 text-white`}>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          In Progress
        </span>
      );
    case 'resolved':
      return (
        <span className={`${baseClasses} bg-gradient-to-r from-green-500 to-emerald-500 text-white`}>
          <CheckCircle className="h-5 w-5 mr-2" />
          Resolved
        </span>
      );
    case 'rejected':
      return (
        <span className={`${baseClasses} bg-gradient-to-r from-red-500 to-pink-500 text-white`}>
          <XCircle className="h-5 w-5 mr-2" />
          Rejected
        </span>
      );
    default:
      return (
        <span className={`${baseClasses}`} style={{
          background: 'rgba(255, 255, 255, 0.10)',
          color: '#cbd5e1',
          border: '1px solid rgba(255, 255, 255, 0.20)'
        }}>
          <AlertCircle className="h-5 w-5 mr-2" />
          Unknown
        </span>
      );
  }
};

export default AdminComplaintDetail;