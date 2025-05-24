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
  UserCheck,
  ExternalLink
} from 'lucide-react';

const ComplaintDetail = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const selectedComplaint = useSelector(state => state.complaints.selectedComplaint);
  
  // Fetch complaint details if not already in state
  const { 
    data: complaintResponse, 
    isLoading, 
    isError, 
    error 
  } = useGetComplaintByIdQuery(complaintId, {
    skip: !!selectedComplaint && selectedComplaint._id === complaintId
  });
  
  // Extract complaint from response
  const complaintData = complaintResponse?.data || complaintResponse;
  
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
    if (complaintData && (!selectedComplaint || selectedComplaint._id !== complaintId)) {
      dispatch(setSelectedComplaint(complaintData));
    }
  }, [complaintData, dispatch, selectedComplaint, complaintId]);
  
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
  
  // Navigate to admin assignment page
  const handleAssignToAdmin = () => {
    navigate(`/superadmin/assign-complaint/${complaintId}`);
  };
  
  // Helper function to get admin email
  const getAssignedAdminEmail = () => {
    if (!complaint) return 'Not assigned';
    
    if (complaint.assignedTo) {
      // If assignedTo is an object with email property
      if (typeof complaint.assignedTo === 'object' && complaint.assignedTo.email) {
        return complaint.assignedTo.email;
      }
      // If assignedTo is just the ID, show a placeholder
      return 'Admin (ID: ' + complaint.assignedTo + ')';
    }
    
    return 'Not assigned yet';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 flex items-center">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
          <span className="ml-3 text-white text-lg">Loading complaint details...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center p-4">
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-400/20 rounded-3xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-200 font-semibold text-xl mb-2">Error loading complaint details</h3>
          <p className="text-red-300">{error?.data?.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center p-4">
        <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-400/20 rounded-3xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-yellow-200 font-semibold text-xl mb-2">Complaint not found</h3>
          <p className="text-yellow-300">The requested complaint could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto py-6">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/superadmin/complaints')}
            className="group flex items-center text-white/70 hover:text-purple-400 transition-all duration-300 backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-2xl px-6 py-3"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Back to complaints</span>
          </button>
        </div>
        
        {/* Main Content */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20">
          {/* Header */}
          <div className="relative border-b border-white/10 px-8 py-6 bg-gradient-to-r from-purple-600/10 to-indigo-600/10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5"></div>
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-3">
                  {complaint.title}
                </h1>
                <div className="flex items-center text-white/60">
                  <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                  <span className="text-lg">Submitted on {formatDate(complaint.createdAt)}</span>
                </div>
              </div>
              <div className="mt-6 lg:mt-0">
                {getStatusBadge(complaint.status)}
              </div>
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-8">
            {/* Left Column: Details */}
            <div className="xl:col-span-2 space-y-8">
              {/* Description */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
                  Description
                </h2>
                <p className="text-white/80 leading-relaxed text-lg whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center text-purple-400 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mr-3">
                      <Tag className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Category</span>
                  </div>
                  <p className="font-semibold text-white text-lg">{complaint.category}</p>
                </div>
                
                <div className="backdrop-blur-xl bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center text-blue-400 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-3">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Landmark</span>
                  </div>
                  <p className="font-semibold text-white text-lg">{complaint.landmark}</p>
                </div>
                
                <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center text-indigo-400 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mr-3">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Submitted By</span>
                  </div>
                  <p className="font-semibold text-white text-lg">
                    {complaint.createdBy?.email || 'Unknown User'}
                  </p>
                </div>
                
                <div className="backdrop-blur-xl bg-gradient-to-br from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center text-pink-400 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center mr-3">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Assigned To</span>
                  </div>
                  <p className="font-semibold text-white text-lg">
                    {getAssignedAdminEmail()}
                  </p>
                </div>
              </div>
              
              {/* Status Update Section */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
                  Update Status
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleStatusChange('pending')}
                    disabled={complaint.status === 'pending' || isUpdating}
                    className={`group flex items-center justify-center px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 ${
                      complaint.status === 'pending' 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 text-yellow-200 cursor-default' 
                        : 'backdrop-blur-xl bg-white/5 border border-yellow-400/30 text-yellow-300 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/20 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/25'
                    }`}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    Mark as Pending
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    disabled={complaint.status === 'in-progress' || isUpdating}
                    className={`group flex items-center justify-center px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 ${
                      complaint.status === 'in-progress' 
                        ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-200 cursor-default' 
                        : 'backdrop-blur-xl bg-white/5 border border-blue-400/30 text-blue-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-indigo-500/20 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25'
                    }`}
                  >
                    <Loader2 className={`h-5 w-5 mr-2 ${complaint.status === 'in-progress' ? 'animate-spin' : ''}`} />
                    Mark as In Progress
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    disabled={complaint.status === 'resolved' || isUpdating}
                    className={`group flex items-center justify-center px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 ${
                      complaint.status === 'resolved' 
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-200 cursor-default' 
                        : 'backdrop-blur-xl bg-white/5 border border-green-400/30 text-green-300 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 hover:scale-105 hover:shadow-xl hover:shadow-green-500/25'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Resolved
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('rejected')}
                    disabled={complaint.status === 'rejected' || isUpdating}
                    className={`group flex items-center justify-center px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 ${
                      complaint.status === 'rejected' 
                        ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-200 cursor-default' 
                        : 'backdrop-blur-xl bg-white/5 border border-red-400/30 text-red-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25'
                    }`}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Mark as Rejected
                  </button>
                </div>
                
                {/* Status Messages */}
                {isUpdating && (
                  <div className="mt-6 flex items-center text-purple-400 backdrop-blur-xl bg-purple-500/10 border border-purple-400/20 rounded-2xl px-4 py-3">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span className="font-medium">Updating status...</span>
                  </div>
                )}
                
                {isUpdateSuccess && (
                  <div className="mt-6 flex items-center text-green-400 backdrop-blur-xl bg-green-500/10 border border-green-400/20 rounded-2xl px-4 py-3">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Status updated successfully</span>
                  </div>
                )}
                
                {updateError && (
                  <div className="mt-6 flex items-center text-red-400 backdrop-blur-xl bg-red-500/10 border border-red-400/20 rounded-2xl px-4 py-3">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">{updateError?.data?.message || 'Failed to update status'}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column: Image and Actions */}
            <div className="space-y-8">
              {/* Complaint Image */}
              {complaint.imageUrl && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
                    Attachment
                  </h2>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                    <img 
                      src={complaint.imageUrl} 
                      alt="Complaint attachment" 
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-4 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border-t border-white/10">
                      <a 
                        href={complaint.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                      >
                        <ExternalLink className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-medium">Open full image</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Admin Assignment */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
                  Admin Assignment
                </h2>
                <button
                  onClick={handleAssignToAdmin}
                  disabled={complaint.status === 'resolved'}
                  className={`group w-full flex justify-center items-center px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 ${
                    complaint.status === 'resolved' 
                      ? 'bg-gray-500/20 border border-gray-400/20 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-900/25 hover:scale-105 hover:shadow-2xl hover:shadow-purple-900/40'
                  }`}
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  {complaint.assignedTo ? 'Reassign Complaint' : 'Assign Complaint'}
                </button>
                
                {complaint.status === 'resolved' ? (
                  <p className="text-white/60 mt-4 text-center">
                    Resolved complaints cannot be reassigned
                  </p>
                ) : complaint.assignedTo ? (
                  <p className="text-white/60 mt-4 text-center">
                    Currently assigned to <span className="font-medium text-purple-400">{getAssignedAdminEmail()}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status badge
const getStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return (
        <div className="flex items-center px-6 py-3 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 shadow-lg">
          <Clock className="h-5 w-5 mr-2 text-yellow-400" />
          <span className="font-semibold text-yellow-200 text-lg">Pending</span>
        </div>
      );
    case 'in-progress':
      return (
        <div className="flex items-center px-6 py-3 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 shadow-lg">
          <Loader2 className="h-5 w-5 mr-2 text-blue-400 animate-spin" />
          <span className="font-semibold text-blue-200 text-lg">In Progress</span>
        </div>
      );
    case 'resolved':
      return (
        <div className="flex items-center px-6 py-3 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 shadow-lg">
          <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
          <span className="font-semibold text-green-200 text-lg">Resolved</span>
        </div>
      );
    case 'rejected':
      return (
        <div className="flex items-center px-6 py-3 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 shadow-lg">
          <XCircle className="h-5 w-5 mr-2 text-red-400" />
          <span className="font-semibold text-red-200 text-lg">Rejected</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center px-6 py-3 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg">
          <AlertCircle className="h-5 w-5 mr-2 text-white/60" />
          <span className="font-semibold text-white/80 text-lg">Unknown</span>
        </div>
      );
  }
};

export default ComplaintDetail;