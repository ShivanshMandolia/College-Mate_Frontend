import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  useGetPlacementDetailsQuery,
} from '../../features/placements/placementsApiSlice';
import { 
  Building, 
  Calendar, 
  Briefcase, 
  ClipboardCheck, 
  FileText,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  UserCheck,
  UserX,
  MapPin,
  DollarSign
} from 'lucide-react';

const PlacementDetailPage = () => {
  const { placementId } = useParams();
  const navigate = useNavigate();
  const { 
    data: placementDetailsResponse, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useGetPlacementDetailsQuery(placementId);

  useEffect(() => {
    // Refetch data when component mounts to ensure we have latest updates
    refetch();
  }, [refetch]);

  // Access the placement data from the response structure
  const placement = placementDetailsResponse?.data || placementDetailsResponse;
  const updates = placement?.updates || [];

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'registered':
        return (
          <span className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center shadow-lg">
            <CheckCircle2 size={16} className="mr-2" />
            Registered
          </span>
        );
      case 'shortlisted':
        return (
          <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-400/30 text-green-300 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center shadow-lg">
            <UserCheck size={16} className="mr-2" />
            Shortlisted
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-md border border-red-400/30 text-red-300 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center shadow-lg">
            <UserX size={16} className="mr-2" />
            Not Selected
          </span>
        );
      case 'not_registered':
      default:
        return (
          <span className="bg-gradient-to-r from-slate-500/20 to-gray-500/20 backdrop-blur-md border border-slate-400/30 text-slate-300 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center shadow-lg">
            <AlertCircle size={16} className="mr-2" />
            Not Registered
          </span>
        );
    }
  };

  const handleRegisterClick = () => {
    navigate(`/student/placements/${placementId}/register`);
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex justify-center items-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
        }}
      >
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-600/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        </div>
        
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin shadow-2xl"></div>
          <div className="mt-6 text-white/80 text-center font-medium">Loading placement details...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    const isAuthError = error?.status === 401 || error?.status === 403;
    const errorMessage = error?.data?.message || 'Failed to load placement details';
    
    return (
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
        }}
      >
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 p-6 max-w-7xl mx-auto">
          <Link 
            to="/student/placements" 
            className="inline-flex items-center text-purple-400 mb-8 hover:text-purple-300 transition-all duration-300 hover:scale-105 hover:translate-x-2 group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Placements</span>
          </Link>
          
          <div 
            className="backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className={`border-2 px-6 py-4 rounded-2xl relative overflow-hidden ${
              isAuthError 
                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-400/30 backdrop-blur-md'
                : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-400/30 backdrop-blur-md'
            }`}>
              <div className="relative z-10">
                <strong className="font-bold text-white text-lg block mb-2">
                  {isAuthError ? '🔒 Access Restricted!' : '❌ Error!'}
                </strong>
                <span className={`block text-base ${
                  isAuthError ? 'text-yellow-200' : 'text-red-200'
                }`}>
                  {errorMessage}
                </span>
                {isAuthError && (
                  <div className="mt-4">
                    <button 
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 text-sm rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!placement) {
    return (
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 p-6 max-w-7xl mx-auto">
          <Link 
            to="/student/placements" 
            className="inline-flex items-center text-purple-400 mb-8 hover:text-purple-300 transition-all duration-300 hover:scale-105 hover:translate-x-2 group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Placements</span>
          </Link>
          
          <div 
            className="backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-400/30 backdrop-blur-md text-yellow-200 px-6 py-4 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <strong className="font-bold text-white text-lg block mb-2">📍 Placement not found!</strong>
                <span className="block text-base">The placement you're looking for doesn't exist.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get registration status from the response
  const registrationStatus = placement?.registrationStatus || 'not_registered';
  
  const isNotRegistered = registrationStatus === 'not_registered';
  const isRegistered = registrationStatus !== 'not_registered';
  const isShortlisted = registrationStatus === 'shortlisted';
  const isRejected = registrationStatus === 'rejected';

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
      }}
    >
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-600/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <Link 
          to="/student/placements" 
          className="inline-flex items-center text-purple-400 mb-8 hover:text-purple-300 transition-all duration-300 hover:scale-105 hover:translate-x-2 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Placements</span>
        </Link>

        <div 
          className="backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-purple-400/30"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Header section */}
          <div className="p-8 border-b border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    {placement?.companyName}
                  </h1>
                  <h2 className="text-2xl font-semibold text-slate-300 mb-6">{placement?.jobTitle}</h2>
                  
                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2">
                      <Calendar size={16} className="mr-2 text-purple-400" />
                      <span className="text-slate-300 font-medium">Deadline: {formatDate(placement?.deadline)}</span>
                    </div>
                    {placement?.location && (
                      <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2">
                        <MapPin size={16} className="mr-2 text-indigo-400" />
                        <span className="text-slate-300 font-medium">{placement.location}</span>
                      </div>
                    )}
                    {placement?.salary && (
                      <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2">
                        <DollarSign size={16} className="mr-2 text-green-400" />
                        <span className="text-slate-300 font-medium">{placement.salary}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 lg:ml-6">
                  {getStatusBadge(registrationStatus)}
                  
                  {isNotRegistered && (
                    <button 
                      onClick={handleRegisterClick}
                      className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white px-8 py-3 rounded-2xl hover:from-green-500 hover:via-emerald-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center font-semibold shadow-xl"
                    >
                      <ClipboardCheck size={20} className="mr-2" />
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Job Description */}
                <div className="backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:border-purple-400/30 hover:scale-[1.02]" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <Briefcase size={24} className="text-white" />
                    </div>
                    Job Description
                  </h3>
                  <div className="prose max-w-none text-slate-300 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    {placement?.jobDescription ? (
                      <div dangerouslySetInnerHTML={{ __html: placement.jobDescription }} />
                    ) : (
                      <p>No job description available.</p>
                    )}
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:border-indigo-400/30 hover:scale-[1.02]" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <ClipboardCheck size={24} className="text-white" />
                    </div>
                    Eligibility Criteria
                  </h3>
                  <div className="prose max-w-none text-slate-300 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    {placement?.eligibilityCriteria ? (
                      <div dangerouslySetInnerHTML={{ __html: placement.eligibilityCriteria }} />
                    ) : (
                      <p>No eligibility criteria specified.</p>
                    )}
                  </div>
                </div>

                {/* Application Link */}
                {placement?.applicationLink && (
                  <div className="backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:border-blue-400/30 hover:scale-[1.02]" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                    <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <ExternalLink size={24} className="text-white" />
                      </div>
                      Application Link
                    </h3>
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-400/30 p-6 rounded-2xl">
                      <a 
                        href={placement.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-semibold flex items-center transition-all duration-300 hover:scale-105 group"
                      >
                        <span className="break-all">{placement.applicationLink}</span>
                        <ExternalLink size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Company Info Card */}
                <div className="bg-gradient-to-br from-purple-600/10 to-indigo-600/10 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <h3 className="font-semibold text-white mb-6 flex items-center text-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <Building size={20} className="text-white" />
                    </div>
                    Company Information
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                      <p className="text-sm font-medium text-purple-400 mb-1">Company</p>
                      <p className="text-white font-semibold">{placement?.companyName}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                      <p className="text-sm font-medium text-indigo-400 mb-1">Position</p>
                      <p className="text-slate-300 font-medium">{placement?.jobTitle}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                      <p className="text-sm font-medium text-pink-400 mb-1">Application Deadline</p>
                      <p className="text-white font-semibold text-red-400">{formatDate(placement?.deadline)}</p>
                    </div>
                  </div>
                </div>

                {/* Registration Status Card */}
                {isRegistered ? (
                  <div className={`backdrop-blur-xl border-2 rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                    isShortlisted ? 'bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-green-400/30' :
                    isRejected ? 'bg-gradient-to-br from-red-600/10 to-pink-600/10 border-red-400/30' :
                    'bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-400/30'
                  }`}>
                    <h3 className="font-semibold text-white mb-4 flex items-center text-lg">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-lg ${
                        isShortlisted ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                        isRejected ? 'bg-gradient-to-r from-red-600 to-pink-600' :
                        'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}>
                        <UserCheck size={20} className="text-white" />
                      </div>
                      Your Application Status
                    </h3>
                    <div className="mb-4">
                      {getStatusBadge(registrationStatus)}
                    </div>
                    {isShortlisted && (
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-md border border-green-400/30 p-4 rounded-2xl">
                        <p className="text-green-300 text-sm font-medium">
                          🎉 Congratulations! You've been shortlisted for the next round. Keep an eye on updates below.
                        </p>
                      </div>
                    )}
                    {isRejected && (
                      <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-md border border-red-400/30 p-4 rounded-2xl">
                        <p className="text-red-300 text-sm">
                          Unfortunately, you were not selected for this position. Don't worry, keep applying to other opportunities!
                        </p>
                      </div>
                    )}
                    {registrationStatus === 'registered' && (
                      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-md border border-blue-400/30 p-4 rounded-2xl">
                        <p className="text-blue-300 text-sm">
                          Your application is under review. We'll notify you about any updates. Check the updates section below regularly.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-xl border-2 border-green-400/30 rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <h3 className="font-semibold text-white mb-4 flex items-center text-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                        <ClipboardCheck size={20} className="text-white" />
                      </div>
                      Apply for This Position
                    </h3>
                    <p className="text-green-300 text-sm mb-6">
                      Register for this placement to receive updates and participate in the selection process.
                    </p>
                    <button 
                      onClick={handleRegisterClick}
                      className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white px-6 py-4 rounded-2xl hover:from-green-500 hover:via-emerald-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center font-semibold shadow-xl"
                    >
                      <ClipboardCheck size={20} className="mr-2" />
                      Register for This Placement
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Updates Section */}
          <div className="border-t border-white/10 bg-gradient-to-r from-slate-900/20 to-purple-900/10">
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <FileText size={24} className="text-white" />
                </div>
                Placement Updates
                {updates.length > 0 && (
                  <span className="ml-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-400/30 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {updates.length}
                  </span>
                )}
              </h3>
              
              {!isRegistered ? (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg flex-shrink-0">
                      <AlertCircle size={28} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-3">Want to receive updates?</h4>
                      <p className="text-yellow-200 mb-6 text-base leading-relaxed">
                        Register for this placement to receive important updates about interview rounds, selection process, and other announcements.
                      </p>
                      <button 
                        onClick={handleRegisterClick}
                        className="bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-700 text-white px-8 py-3 rounded-2xl hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center font-semibold shadow-xl"
                      >
                        <ClipboardCheck size={18} className="mr-2" />
                        Register Now to View Updates
                      </button>
                    </div>
                  </div>
                </div>
              ) : updates.length === 0 ? (
                <div className="backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  <div className="w-20 h-20 bg-gradient-to-r from-slate-600/20 to-gray-600/20 backdrop-blur-md border border-slate-400/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FileText size={40} className="text-slate-400" />
                  </div>
                  <p className="text-slate-300 text-xl font-medium mb-2">No updates available yet.</p>
                  <p className="text-slate-400 text-base">
                    We'll notify you when there are new updates about this placement.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {updates.map((update, index) => (
                    <div 
                      key={update._id || index} 
                      className={`backdrop-blur-xl border-l-4 rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${
                        update.roundType === 'round-specific' 
                          ? 'bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-l-green-400 border border-green-400/30' 
                          : 'bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-l-blue-400 border border-blue-400/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg ${
                            update.roundType === 'round-specific' 
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                          }`}>
                            <FileText size={24} className="text-white" />
                          </div>
                          <span className="font-semibold text-white text-lg">
                            {update.roundType === 'round-specific' ? 'Round Specific Update' : 'General Update'}
                          </span>
                        </div>
                        <span 
                          className={`px-4 py-2 rounded-2xl text-sm font-semibold backdrop-blur-md border shadow-lg ${
                            update.roundType === 'round-specific' 
                              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-300' 
                              : 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/30 text-blue-300'
                          }`}
                        >
                          {update.roundType === 'round-specific' ? 'Shortlisted Students' : 'All Applicants'}
                        </span>
                      </div>
                      
                      <div className="prose max-w-none mb-6">
                        <p className="text-slate-300 text-base leading-relaxed bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                          {update.updateText}
                        </p>
                      </div>
                      
                      <div className="flex items-center text-sm text-slate-400 pt-4 border-t border-white/10">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-md border border-purple-400/30 rounded-xl flex items-center justify-center mr-3">
                          <Clock size={16} className="text-purple-400" />
                        </div>
                        <span className="font-medium text-slate-300">{formatDateTime(update.datePosted)}</span>
                        {update.postedBy && (update.postedBy.name || update.postedBy.email) && (
                          <>
                            <span className="mx-3 text-slate-500">•</span>
                            <span className="text-slate-400">Posted by {update.postedBy.name || update.postedBy.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDetailPage;