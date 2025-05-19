import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  useGetAdminComplaintStatusQuery,
  useAssignComplaintToAdminMutation,
  useGetComplaintByIdQuery
} from '../../features/complaints/complaintsApiSlice';
import { selectSelectedComplaint } from '../../features/complaints/complaintsSlice';
import { 
  ArrowLeft, 
  Shield, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Briefcase,
  AlertCircle,
  Loader2
} from 'lucide-react';

const AssignComplaint = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  
  // Get the selected complaint from Redux store
  const selectedComplaint = useSelector(selectSelectedComplaint);
  
  // Fetch complaint data if not in Redux store
  const { 
    data: complaintResponse,
    isLoading: isComplaintLoading
  } = useGetComplaintByIdQuery(complaintId, {
    skip: !!selectedComplaint && selectedComplaint._id === complaintId
  });
  
  // Extract complaint from response
  const complaintData = complaintResponse?.data || complaintResponse;
  
  // Use either the cached complaint or fetched data
  const complaint = selectedComplaint?._id === complaintId 
    ? selectedComplaint 
    : complaintData;
  
  // Fetch admin statuses
  const {
    data: adminsResponse,
    isLoading: isAdminsLoading,
    isError: isAdminsError,
    error: adminsError,
    refetch: refetchAdminStatus
  } = useGetAdminComplaintStatusQuery();
  
  // Extract admins from response - try both possible structures
  const admins = adminsResponse?.data || adminsResponse || [];
  
  // Debug logging
  console.log('Admins response:', adminsResponse);
  console.log('Extracted admins:', admins);
  console.log('Complaint response:', complaintResponse);
  console.log('Extracted complaint:', complaintData);
  
  // Assign complaint mutation
  const [
    assignComplaint,
    { isLoading: isAssigning, isSuccess: isAssignSuccess, error: assignError, reset: resetAssign }
  ] = useAssignComplaintToAdminMutation();
  
  // Track which admin is being assigned
  const [assigningAdminId, setAssigningAdminId] = useState(null);
  
  // Reset success/error states when navigating away
  useEffect(() => {
    return () => {
      resetAssign();
    };
  }, [resetAssign]);
  
  // Handle assigning complaint to admin
  const handleAssign = async (adminId) => {
    setAssigningAdminId(adminId);
    try {
      await assignComplaint({ complaintId, assignedTo: adminId }).unwrap();
      // Success message will display via isAssignSuccess
      setTimeout(() => {
        navigate(`/superadmin/complaints/${complaintId}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to assign complaint:', err);
      // Error will display via assignError
      setAssigningAdminId(null);
    }
  };
  
  // Format date in a readable way
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isLoading = isComplaintLoading || isAdminsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (isAdminsError) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-50 rounded-lg p-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
        <div className="ml-3">
          <h3 className="text-red-800 font-medium">Error loading admin data</h3>
          <p className="text-red-700 mt-1">{adminsError?.data?.message || adminsError?.message || 'Something went wrong'}</p>
          <button 
            onClick={() => refetchAdminStatus()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate(`/superadmin/complaints/${complaintId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to complaint details
        </button>
      </div>
      
      {/* Complaint Summary */}
      {complaint && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Complaint Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
              <p className="font-medium text-gray-900 dark:text-white">{complaint.title}</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
              <p className="font-medium text-gray-900 dark:text-white">{complaint.category}</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Submitted On</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(complaint.createdAt)}</p>
            </div>
          </div>
          
          {complaint.assignedTo && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-4 border-amber-400">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    This complaint is already assigned
                  </h3>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-200">
                    Currently assigned to {complaint.assignedTo.email || complaint.assignedTo}. 
                    Reassigning will notify the new admin.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Admin Assignment Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Select Admin to Assign Complaint
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 ml-7">
            Select an admin to handle this complaint. Admins with "Free" status are currently not assigned to any active complaints.
          </p>        
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.isArray(admins) && admins.length > 0 ? (
  admins.map((admin, index) => (
    <div 
      key={admin.adminId || admin._id || admin.id} 
      className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
        isAssignSuccess && assigningAdminId === (admin.adminId || admin._id || admin.id)
          ? 'bg-green-50 dark:bg-green-900/20' 
          : ''
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-start">
          <div className={`p-2 rounded-md ${
            admin.status === 'free' 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-amber-100 dark:bg-amber-900/30'
          }`}>
            {admin.status === 'free' ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="ml-3">
            {/* Show admin name if present, else admin1, admin2, ... */}
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {admin.name || admin.username || `admin${index + 1}`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{admin.email || 'No email provided'}</p>
            <div className="flex items-center mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                admin.status === 'free'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
              }`}>
                {admin.status === 'free' ? 'Free' : 'Busy'}
              </span>
            </div>
          </div>
        </div>

     

                  
                  <div className="mt-4 md:mt-0 flex items-center">
                    {admin.status === 'busy' && admin.currentComplaint && (
                      <div className="mr-4 text-right hidden md:block">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Current Assignment:</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">
                          {admin.currentComplaint.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Status: {admin.currentComplaint.status}
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleAssign(admin.adminId || admin._id || admin.id)}
                      disabled={isAssigning && assigningAdminId === (admin.adminId || admin._id || admin.id)}
                      className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        ${admin.status === 'free' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isAssigning && assigningAdminId === (admin.adminId || admin._id || admin.id) ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Assigning...
                        </>
                      ) : isAssignSuccess && assigningAdminId === (admin.adminId || admin._id || admin.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Assigned Successfully
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          {admin.status === 'free' ? 'Assign' : 'Reassign'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Current complaint info for mobile view */}
                {admin.status === 'busy' && admin.currentComplaint && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md md:hidden">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Current Assignment:
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {admin.currentComplaint.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Status: {admin.currentComplaint.status}
                    </p>
                  </div>
                )}
                
                {/* Assignment error message */}
                {assignError && assigningAdminId === (admin.adminId || admin._id || admin.id) && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <div className="flex items-start">
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                      <p className="ml-2 text-sm text-red-600 dark:text-red-400">
                        {assignError?.data?.message || assignError?.message || 'Failed to assign complaint to this admin'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No admins available</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isAdminsLoading 
                  ? 'Loading admin data...' 
                  : 'There are no admins available in the system to assign complaints to.'
                }
              </p>
              <button
                onClick={() => refetchAdminStatus()}
                className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Retry loading admins
              </button>
            </div>
          )}
        </div>
        
        {/* Refresh button */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
          <button
            onClick={() => refetchAdminStatus()}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Refresh admin status
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignComplaint;