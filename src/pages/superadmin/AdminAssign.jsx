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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
            <span className="text-white text-lg font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isAdminsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-400/20 rounded-3xl p-8 text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-red-300 font-semibold text-lg mb-2">Error loading admin data</h3>
            <p className="text-red-200/80 mb-4">{adminsError?.data?.message || adminsError?.message || 'Something went wrong'}</p>
            <button 
              onClick={() => refetchAdminStatus()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-medium hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(`/superadmin/complaints/${complaintId}`)}
            className="flex items-center text-purple-300 hover:text-white bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 font-medium hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to complaint details
          </button>
        </div>
        
        {/* Complaint Summary */}
        {complaint && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 hover:bg-white/10 transition-all duration-500">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              Complaint Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
                <p className="text-purple-300 text-sm font-medium mb-2">Title</p>
                <p className="text-white font-semibold text-lg">{complaint.title}</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-6">
                <p className="text-indigo-300 text-sm font-medium mb-2">Category</p>
                <p className="text-white font-semibold text-lg">{complaint.category}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6">
                <p className="text-yellow-300 text-sm font-medium mb-2">Submitted On</p>
                <p className="text-white font-semibold text-lg">{formatDate(complaint.createdAt)}</p>
              </div>
            </div>
            
            {complaint.assignedTo && (
              <div className="mt-6 bg-orange-500/10 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-orange-300 font-semibold text-lg mb-1">
                      This complaint is already assigned
                    </h3>
                    <p className="text-orange-200/80">
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="border-b border-white/10 p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Select Admin to Assign Complaint
              </h1>
            </div>
            <p className="text-slate-300 text-lg ml-16">
              Select an admin to handle this complaint. Admins with "Free" status are currently not assigned to any active complaints.
            </p>        
          </div>
          
          <div className="divide-y divide-white/10">
            {Array.isArray(admins) && admins.length > 0 ? (
              admins.map((admin, index) => (
                <div 
                  key={admin.adminId || admin._id || admin.id} 
                  className={`p-8 hover:bg-white/5 transition-all duration-500 ${
                    isAssignSuccess && assigningAdminId === (admin.adminId || admin._id || admin.id)
                      ? 'bg-green-500/10 border-l-4 border-green-400' 
                      : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-6 ${
                        admin.status === 'free' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}>
                        {admin.status === 'free' ? (
                          <CheckCircle className="h-8 w-8 text-white" />
                        ) : (
                          <Clock className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-white mb-1">
                          {admin.name || admin.username || `admin${index + 1}`}
                        </p>
                        <p className="text-slate-300 mb-3">{admin.email || 'No email provided'}</p>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
                            admin.status === 'free'
                              ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                          }`}>
                            {admin.status === 'free' ? 'Free' : 'Busy'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 lg:mt-0 flex items-center">
                      {admin.status === 'busy' && admin.currentComplaint && (
                        <div className="mr-6 text-right hidden lg:block">
                          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                            <p className="text-slate-400 text-sm font-medium mb-1">Current Assignment:</p>
                            <p className="text-white font-semibold mb-1 max-w-xs truncate">
                              {admin.currentComplaint.title}
                            </p>
                            <p className="text-slate-300 text-sm">
                              Status: {admin.currentComplaint.status}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleAssign(admin.adminId || admin._id || admin.id)}
                        disabled={isAssigning && assigningAdminId === (admin.adminId || admin._id || admin.id)}
                        className={`flex items-center px-8 py-4 rounded-2xl font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                          ${admin.status === 'free' 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 hover:shadow-green-500/25' 
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 hover:shadow-purple-500/25'
                          }`}
                      >
                        {isAssigning && assigningAdminId === (admin.adminId || admin._id || admin.id) ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                            Assigning...
                          </>
                        ) : isAssignSuccess && assigningAdminId === (admin.adminId || admin._id || admin.id) ? (
                          <>
                            <CheckCircle className="h-5 w-5 mr-3" />
                            Assigned Successfully
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-5 w-5 mr-3" />
                            {admin.status === 'free' ? 'Assign' : 'Reassign'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Current complaint info for mobile view */}
                  {admin.status === 'busy' && admin.currentComplaint && (
                    <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 lg:hidden">
                      <div className="flex items-center mb-2">
                        <Briefcase className="h-5 w-5 text-purple-400 mr-2" />
                        <p className="text-purple-300 font-medium">
                          Current Assignment:
                        </p>
                      </div>
                      <p className="text-white font-semibold mb-2">
                        {admin.currentComplaint.title}
                      </p>
                      <p className="text-slate-300 text-sm">
                        Status: {admin.currentComplaint.status}
                      </p>
                    </div>
                  )}
                  
                  {/* Assignment error message */}
                  {assignError && assigningAdminId === (admin.adminId || admin._id || admin.id) && (
                    <div className="mt-6 bg-red-500/10 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4">
                      <div className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                        <p className="text-red-300">
                          {assignError?.data?.message || assignError?.message || 'Failed to assign complaint to this admin'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No admins available</h3>
                <p className="text-slate-300 text-lg mb-6 max-w-md mx-auto">
                  {isAdminsLoading 
                    ? 'Loading admin data...' 
                    : 'There are no admins available in the system to assign complaints to.'
                  }
                </p>
                <button
                  onClick={() => refetchAdminStatus()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center mx-auto"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Retry loading admins
                </button>
              </div>
            )}
          </div>
          
          {/* Refresh button */}
          <div className="bg-white/5 border-t border-white/10 p-6">
            <button
              onClick={() => refetchAdminStatus()}
              className="flex items-center text-purple-300 hover:text-white bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 font-medium hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Refresh admin status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignComplaint;