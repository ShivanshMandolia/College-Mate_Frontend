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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading complaint details...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-50 rounded-lg p-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
        <div className="ml-3">
          <h3 className="text-red-800 font-medium">Error loading complaint details</h3>
          <p className="text-red-700 mt-1">{error?.data?.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex justify-center items-center h-64 bg-yellow-50 rounded-lg p-4">
        <AlertCircle className="h-8 w-8 text-yellow-600" />
        <div className="ml-3">
          <h3 className="text-yellow-800 font-medium">Complaint not found</h3>
          <p className="text-yellow-700 mt-1">The requested complaint could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/admin/complaints')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to complaints
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Complaint Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {complaint.title}
              </h1>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Submitted on {formatDate(complaint.createdAt)}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              {getStatusBadge(complaint.status)}
            </div>
          </div>
        </div>
        
        {/* Complaint Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Column: Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {complaint.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>Category</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{complaint.category}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Landmark</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{complaint.landmark}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <User className="h-4 w-4 mr-1" />
                  <span>Submitted By</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {complaint.createdBy?.email || 'Unknown User'}
                </p>
              </div>
            </div>
            
            {/* Status Update Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Update Status</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange('pending')}
                  disabled={complaint.status === 'pending' || isUpdating}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    complaint.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 cursor-default' 
                      : 'bg-white border border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                  }`}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Mark as Pending
                </button>
                
                <button
                  onClick={() => handleStatusChange('in-progress')}
                  disabled={complaint.status === 'in-progress' || isUpdating}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    complaint.status === 'in-progress' 
                      ? 'bg-blue-100 text-blue-800 cursor-default' 
                      : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <Loader2 className={`h-4 w-4 mr-1 ${complaint.status === 'in-progress' ? 'animate-spin' : ''}`} />
                  Mark as In Progress
                </button>
                
                <button
                  onClick={() => handleStatusChange('resolved')}
                  disabled={complaint.status === 'resolved' || isUpdating}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    complaint.status === 'resolved' 
                      ? 'bg-green-100 text-green-800 cursor-default' 
                      : 'bg-white border border-green-200 text-green-700 hover:bg-green-50'
                  }`}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Resolved
                </button>
                
                <button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={complaint.status === 'rejected' || isUpdating}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    complaint.status === 'rejected' 
                      ? 'bg-red-100 text-red-800 cursor-default' 
                      : 'bg-white border border-red-200 text-red-700 hover:bg-red-50'
                  }`}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Mark as Rejected
                </button>
              </div>
              
              {isUpdating && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Updating status...
                </p>
              )}
              
              {isUpdateSuccess && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Status updated successfully
                </p>
              )}
              
              {updateError && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {updateError?.data?.message || 'Failed to update status'}
                </p>
              )}
            </div>
          </div>
          
          {/* Right Column: Image */}
          <div className="space-y-6">
            {/* Complaint Image */}
            {complaint.imageUrl && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Attachment</h2>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={complaint.imageUrl} 
                    alt="Complaint attachment" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
                    <a 
                      href={complaint.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
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
  );
};

// Helper function to get status badge
const getStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return (
        <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-4 w-4 mr-1" />
          Pending
        </span>
      );
    case 'in-progress':
      return (
        <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          In Progress
        </span>
      );
    case 'resolved':
      return (
        <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Resolved
        </span>
      );
    case 'rejected':
      return (
        <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <XCircle className="h-4 w-4 mr-1" />
          Rejected
        </span>
      );
    default:
      return (
        <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          <AlertCircle className="h-4 w-4 mr-1" />
          Unknown
        </span>
      );
  }
};

export default AdminComplaintDetail;