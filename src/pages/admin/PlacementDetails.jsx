// src/features/admin/PlacementDetails.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetPlacementDetailsQuery,
  useGetAllRegisteredStudentsForPlacementQuery,
  useUpdateStudentStatusMutation 
} from '../../features/placements/placementsApiSlice';
import { 
  selectSelectedPlacement,
  setSelectedPlacement 
} from '../../features/placements/placementsSlice';
import { format } from 'date-fns';
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  Link as LinkIcon, 
  FileText, 
  Bell, 
  Users, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  FileSpreadsheet,
  Loader2,
  UserCircle
} from 'lucide-react';

const PlacementDetails = () => {
  const { placementId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get the selected placement from Redux
  const selectedPlacement = useSelector(selectSelectedPlacement);
  
  // Fetch placement details if not in Redux state
  const { 
    data: placementResponse, 
    isLoading: isLoadingPlacement,
    error: placementError 
  } = useGetPlacementDetailsQuery(placementId, {
    skip: !!selectedPlacement
  });
  
  // Fetch registered students
  const { 
    data: registeredStudentsResponse, 
    isLoading: isLoadingStudents,
    error: studentsError,
    refetch: refetchStudents
  } = useGetAllRegisteredStudentsForPlacementQuery(placementId);
  
  console.log("Placement Response:", placementResponse);
  console.log("Registered Students Response:", registeredStudentsResponse);
  
  // Set selected placement in Redux if it's not already there
  useEffect(() => {
    if (!selectedPlacement && placementResponse?.success && placementResponse?.data) {
      dispatch(setSelectedPlacement(placementResponse.data));
    }
  }, [placementResponse, selectedPlacement, dispatch]);
  
  // Get the placement to display - FIXED: Use placementResponse.data when available
  const placement = selectedPlacement || (placementResponse?.success ? placementResponse.data : null);
  
  // Update student status mutation
  const [updateStudentStatus, { isLoading: isUpdatingStatus }] = useUpdateStudentStatusMutation();
  
  // Handle student status change
  const handleStatusChange = async (studentId, newStatus) => {
    try {
      console.log(`Updating student ${studentId} to status ${newStatus}`);
      
      const result = await updateStudentStatus({
        placementId,
        statusData: { studentId, status: newStatus }
      }).unwrap();
      
      console.log("Update result:", result);
      
      // Refetch the registered students data to get updated status
      await refetchStudents();
      
      // Show success notification
      alert(`Student ${newStatus} successfully!`);
    } catch (error) {
      console.error('Failed to update student status:', error);
      alert(`Failed to update status: ${error?.data?.message || error?.message || 'Unknown error'}`);
    }
  };
  
  if (isLoadingPlacement || isLoadingStudents) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading placement details...</p>
      </div>
    );
  }
  
  if (placementError || !placement) {
    return (
      <div className="bg-red-50 rounded-lg p-6 flex items-center gap-3 max-w-lg mx-auto mt-8">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="text-red-600 font-medium">
            {placementError ? 'Error loading placement' : 'Placement not found'}
          </p>
          {placementError && (
            <p className="text-red-500 text-sm mt-1">
              {placementError?.data?.message || placementError?.message || 'Unknown error'}
            </p>
          )}
        </div>
      </div>
    );
  }
  
  // Handle different response structures for registered students
  let registeredStudents = [];
  if (registeredStudentsResponse) {
    if (registeredStudentsResponse.success && registeredStudentsResponse.data) {
      // API response with success wrapper
      registeredStudents = registeredStudentsResponse.data;
    } else if (Array.isArray(registeredStudentsResponse)) {
      // Direct array response
      registeredStudents = registeredStudentsResponse;
    }
  }
  
  console.log("Final registered students:", registeredStudents);
  console.log("Placement updates:", placement.updates); // Debug log for updates
  
  // Calculate status counts
  const statusCounts = {
    total: registeredStudents.length,
    shortlisted: registeredStudents.filter(r => r.status === 'shortlisted').length,
    rejected: registeredStudents.filter(r => r.status === 'rejected').length,
    pending: registeredStudents.filter(r => r.status === 'registered' || !r.status || r.status === 'pending').length
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-4 shadow-md mb-8">
        <div className="container mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1 text-blue-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-8 w-8" />
                {placement.companyName}
              </h1>
              <p className="text-blue-100 mt-1 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {placement.jobTitle}
              </p>
            </div>
            <button
              onClick={() => navigate(`/admin/placements/${placementId}/update`)}
              className="bg-white text-blue-600 px-4 py-2 rounded-md shadow hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Update
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p><strong>Debug Info:</strong></p>
            <p>Placement loaded: {String(!!placement)}</p>
            <p>Updates count: {placement?.updates?.length || 0}</p>
            <p>Students API success: {String(registeredStudentsResponse?.success)}</p>
            <p>Students count: {registeredStudents.length}</p>
            <p>Students error: {studentsError ? JSON.stringify(studentsError) : 'None'}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Placement Details Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-2">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Placement Details
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <p className="text-gray-500 text-sm mb-1">Job Title</p>
                    <p className="font-medium text-gray-800">{placement.jobTitle}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-500 text-sm mb-1">Application Deadline</p>
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      {format(new Date(placement.deadline), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-500 text-sm mb-1">Application Link</p>
                    <a 
                      href={placement.applicationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Apply Here
                    </a>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-500 text-sm mb-1">Eligibility Criteria</p>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="whitespace-pre-line text-gray-800">{placement.eligibilityCriteria}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm mb-1">Job Description</p>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="whitespace-pre-line text-gray-800">{placement.jobDescription}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Placement Status
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-800">Total Registrations</span>
                  </div>
                  <span className="font-bold text-blue-600">{statusCounts.total}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-gray-800">Shortlisted</span>
                  </div>
                  <span className="font-bold text-green-600">{statusCounts.shortlisted}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-100">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-gray-800">Pending</span>
                  </div>
                  <span className="font-bold text-yellow-600">{statusCounts.pending}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-gray-800">Rejected</span>
                  </div>
                  <span className="font-bold text-red-600">{statusCounts.rejected}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Updates Section - FIXED */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Updates ({placement.updates?.length || 0})
            </h2>
          </div>
          
          <div className="p-6">
            {placement.updates && placement.updates.length > 0 ? (
              <div className="space-y-6">
                {placement.updates.map((update, index) => (
                  <div key={update._id || index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col">
                      <p className="whitespace-pre-line text-gray-800 mb-3">{update.updateText}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <UserCircle className="h-4 w-4 mr-1" />
                        <span>
                          {/* FIXED: Handle postedBy object structure */}
                          {update.postedBy?.email || update.postedBy?._id || update.postedBy || 'Unknown Admin'}
                        </span>
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{format(new Date(update.datePosted), 'MMM d, yyyy')}</span>
                        <span className="mx-2">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          update.roundType === 'common' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {/* FIXED: Handle roundType properly */}
                          {update.roundType === 'common' ? 'Common' : 
                           update.roundType === 'round-specific' ? 'Round Specific' : 
                           update.roundType || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Bell className="h-12 w-12 text-gray-300 mb-2" />
                <p>No updates posted yet.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Registered Students Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              Registered Students ({registeredStudents.length})
            </h2>
          </div>
          
          <div className="p-6">
            {studentsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">
                  Error loading students: {studentsError?.data?.message || studentsError?.message || 'Unknown error'}
                </p>
              </div>
            )}
            
            {registeredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registeredStudents.map((registration) => (
                      <tr key={registration.student_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {registration.student?.name || ` ${registration.student?.email || registration.student || 'N/A'}`}
                              </div>
                             
                              {registration.student?.rollNumber && (
                                <div className="text-sm text-gray-500">
                                  Roll: {registration.student.rollNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.resumeLink ? (
                            <a 
                              href={registration.resumeLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              View Resume
                            </a>
                          ) : 'No resume'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {registration.googleFormLink || 'NA'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            registration.status === 'shortlisted' 
                              ? 'bg-green-100 text-green-800' 
                              : registration.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {registration.status || 'registered'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(registration.student?._id || registration.student, 'shortlisted')}
                              disabled={registration.status === 'shortlisted' || isUpdatingStatus}
                              className={`inline-flex items-center px-2 py-1 border rounded-md ${
                                registration.status === 'shortlisted' || isUpdatingStatus
                                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                              } transition-colors`}
                            >
                              {isUpdatingStatus ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              )}
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleStatusChange(registration.student?._id || registration.student, 'rejected')}
                              disabled={registration.status === 'rejected' || isUpdatingStatus}
                              className={`inline-flex items-center px-2 py-1 border rounded-md ${
                                registration.status === 'rejected' || isUpdatingStatus
                                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                              } transition-colors`}
                            >
                              {isUpdatingStatus ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Users className="h-16 w-16 text-gray-300 mb-3" />
                <p className="text-lg">No students have registered for this placement yet.</p>
                <p className="text-sm mt-1">Registered students will appear here once they apply.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDetails;