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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12 text-center">
          <Loader2 className="h-16 w-16 text-purple-400 animate-spin mb-6 mx-auto" />
          <p className="text-2xl text-white font-medium">Loading placement details...</p>
          <p className="text-slate-300 mt-2">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }
  
  if (placementError || !placement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-3xl p-8 max-w-lg text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {placementError ? 'Error Loading Placement' : 'Placement Not Found'}
          </h2>
          {placementError && (
            <p className="text-red-300 mb-6">
              {placementError?.data?.message || placementError?.message || 'Unknown error'}
            </p>
          )}
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20"></div>
        <div className="relative px-4 py-12">
          <div className="container mx-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-purple-300 hover:text-white mb-8 transition-all duration-300 transform hover:translate-x-1 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Back to dashboard</span>
            </button>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  {placement.companyName}
                </h1>
                <div className="flex items-center gap-3 text-2xl text-slate-300 mb-2">
                  <Briefcase className="h-6 w-6 text-purple-400" />
                  <span className="font-medium">{placement.jobTitle}</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-slate-400">
                  <Calendar className="h-5 w-5 text-pink-400" />
                  <span>Deadline: {format(new Date(placement.deadline), 'MMMM d, yyyy')}</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate(`/admin/placements/${placementId}/update`)}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(147,51,234,0.25)] flex items-center gap-3"
              >
                <Plus className="h-5 w-5" />
                Add Update
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* Placement Details Card */}
          <div className="xl:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/10 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                Placement Details
              </h2>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div>
                    <p className="text-slate-400 text-sm mb-2 font-medium">Job Title</p>
                    <p className="text-xl font-semibold text-white">{placement.jobTitle}</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm mb-2 font-medium">Application Deadline</p>
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg font-medium">
                        {format(new Date(placement.deadline), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm mb-2 font-medium">Application Link</p>
                    <a 
                      href={placement.applicationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <LinkIcon className="h-5 w-5" />
                      Apply Here
                    </a>
                  </div>
                </div>
                
                <div>
                  <p className="text-slate-400 text-sm mb-3 font-medium">Eligibility Criteria</p>
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                    <p className="whitespace-pre-line text-slate-300 leading-relaxed">{placement.eligibilityCriteria}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-slate-400 text-sm mb-3 font-medium">Job Description</p>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <p className="whitespace-pre-line text-slate-300 leading-relaxed">{placement.jobDescription}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-fit">
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/10 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                Status Overview
              </h2>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-6 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white font-semibold text-lg">Total Registrations</span>
                    </div>
                    <span className="text-3xl font-bold text-blue-400">{statusCounts.total}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white font-semibold text-lg">Shortlisted</span>
                    </div>
                    <span className="text-3xl font-bold text-green-400">{statusCounts.shortlisted}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-6 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white font-semibold text-lg">Pending</span>
                    </div>
                    <span className="text-3xl font-bold text-yellow-400">{statusCounts.pending}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-2xl p-6 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <XCircle className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white font-semibold text-lg">Rejected</span>
                    </div>
                    <span className="text-3xl font-bold text-red-400">{statusCounts.rejected}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Updates Section */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              Updates ({placement.updates?.length || 0})
            </h2>
          </div>
          
          <div className="p-8">
            {placement.updates && placement.updates.length > 0 ? (
              <div className="space-y-6">
                {placement.updates.map((update, index) => (
                  <div key={update._id || index} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300">
                    <p className="whitespace-pre-line text-slate-200 text-lg leading-relaxed mb-4">{update.updateText}</p>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-purple-400" />
                        <span>{update.postedBy?.email || update.postedBy?._id || update.postedBy || 'Unknown Admin'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-400" />
                        <span>{format(new Date(update.datePosted), 'MMM d, yyyy')}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        update.roundType === 'common' 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {update.roundType === 'common' ? 'Common' : 
                         update.roundType === 'round-specific' ? 'Round Specific' : 
                         update.roundType || 'General'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mb-6">
                  <Bell className="h-12 w-12 text-purple-400" />
                </div>
                <p className="text-xl font-medium text-slate-300 mb-2">No updates posted yet</p>
                <p className="text-slate-400">Updates will appear here when posted by admins</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Registered Students Section */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border-b border-white/10 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              Registered Students ({registeredStudents.length})
            </h2>
          </div>
          
          <div className="p-8">
            {studentsError && (
              <div className="bg-red-500/10 backdrop-blur border border-red-500/20 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <p className="text-red-300 font-medium">
                    Error loading students: {studentsError?.data?.message || studentsError?.message || 'Unknown error'}
                  </p>
                </div>
              </div>
            )}
            
            {registeredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Resume
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {registeredStudents.map((registration) => (
                      <tr key={registration.student_id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                              <UserCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-white">
                                {registration.student?.name || registration.student?.email || registration.student || 'N/A'}
                              </div>
                              {registration.student?.rollNumber && (
                                <div className="text-sm text-slate-400">
                                  Roll: {registration.student.rollNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          {registration.resumeLink ? (
                            <a 
                              href={registration.resumeLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                              <FileText className="h-4 w-4" />
                              View Resume
                            </a>
                          ) : (
                            <span className="text-slate-400">No resume</span>
                          )}
                        </td>
                        <td className="px-6 py-6 text-slate-300 font-medium">
                          {registration.googleFormLink || 'NA'}
                        </td>
                        <td className="px-6 py-6">
                          <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-xl ${
                            registration.status === 'shortlisted' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : registration.status === 'rejected'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}>
                            {registration.status || 'registered'}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleStatusChange(registration.student?._id || registration.student, 'shortlisted')}
                              disabled={registration.status === 'shortlisted' || isUpdatingStatus}
                              className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                registration.status === 'shortlisted' || isUpdatingStatus
                                  ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-600/30'
                                  : 'bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 hover:scale-105 transform'
                              }`}
                            >
                              {isUpdatingStatus ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                              )}
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleStatusChange(registration.student?._id || registration.student, 'rejected')}
                              disabled={registration.status === 'rejected' || isUpdatingStatus}
                              className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                registration.status === 'rejected' || isUpdatingStatus
                                  ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-600/30'
                                  : 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 hover:scale-105 transform'
                              }`}
                            >
                              {isUpdatingStatus ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
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
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mb-8">
                  <Users className="h-16 w-16 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-2">No students registered yet</h3>
                <p className="text-lg text-slate-400 text-center max-w-md">
                  Registered students will appear here once they apply for this placement opportunity.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDetails;