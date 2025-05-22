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
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <CheckCircle2 size={16} className="mr-1" />
            Registered
          </span>
        );
      case 'shortlisted':
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <UserCheck size={16} className="mr-1" />
            Shortlisted
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <UserX size={16} className="mr-1" />
            Not Selected
          </span>
        );
      case 'not_registered':
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <AlertCircle size={16} className="mr-1" />
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
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    const isAuthError = error?.status === 401 || error?.status === 403;
    const errorMessage = error?.data?.message || 'Failed to load placement details';
    
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Link to="/student/placements" className="flex items-center text-blue-600 mb-6 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to Placements
        </Link>
        <div className={`border px-4 py-3 rounded relative ${
          isAuthError 
            ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
            : 'bg-red-100 border-red-400 text-red-700'
        }`} role="alert">
          <strong className="font-bold">
            {isAuthError ? 'Access Restricted!' : 'Error!'}
          </strong>
          <span className="block sm:inline"> {errorMessage}</span>
          {isAuthError && (
            <div className="mt-2">
              <button 
                onClick={() => window.location.reload()}
                className="bg-yellow-600 text-white px-3 py-1 text-sm rounded hover:bg-yellow-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!placement) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Link to="/student/placements" className="flex items-center text-blue-600 mb-6 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to Placements
        </Link>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Placement not found!</strong>
          <span className="block sm:inline"> The placement you're looking for doesn't exist.</span>
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
    <div className="p-6 max-w-7xl mx-auto">
      <Link to="/student/placements" className="flex items-center text-blue-600 mb-6 hover:underline">
        <ArrowLeft size={16} className="mr-1" />
        Back to Placements
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {/* Header section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{placement?.companyName}</h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{placement?.jobTitle}</h2>
              
              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>Deadline: {formatDate(placement?.deadline)}</span>
                </div>
                {placement?.location && (
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span>{placement.location}</span>
                  </div>
                )}
                {placement?.salary && (
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-1" />
                    <span>{placement.salary}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:ml-4">
              {getStatusBadge(registrationStatus)}
              
              {isNotRegistered && (
                <button 
                  onClick={handleRegisterClick}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium"
                >
                  <ClipboardCheck size={18} className="mr-2" />
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Briefcase size={20} className="mr-2 text-blue-600" />
                  Job Description
                </h3>
                <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {placement?.jobDescription ? (
                    <div dangerouslySetInnerHTML={{ __html: placement.jobDescription }} />
                  ) : (
                    <p>No job description available.</p>
                  )}
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <ClipboardCheck size={20} className="mr-2 text-blue-600" />
                  Eligibility Criteria
                </h3>
                <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {placement?.eligibilityCriteria ? (
                    <div dangerouslySetInnerHTML={{ __html: placement.eligibilityCriteria }} />
                  ) : (
                    <p>No eligibility criteria specified.</p>
                  )}
                </div>
              </div>

              {/* Application Link */}
              {placement?.applicationLink && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <ExternalLink size={20} className="mr-2 text-blue-600" />
                    Application Link
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <a 
                      href={placement.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      {placement.applicationLink}
                      <ExternalLink size={16} className="ml-2" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Company Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Building size={18} className="mr-2 text-blue-600" />
                  Company Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Company</p>
                    <p className="text-gray-800 font-medium">{placement?.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Position</p>
                    <p className="text-gray-800">{placement?.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Application Deadline</p>
                    <p className="text-gray-800 font-medium text-red-600">{formatDate(placement?.deadline)}</p>
                  </div>
                </div>
              </div>

              {/* Registration Status Card */}
              {isRegistered ? (
                <div className={`rounded-lg p-6 border-2 ${
                  isShortlisted ? 'bg-green-50 border-green-200' :
                  isRejected ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <UserCheck size={18} className="mr-2" />
                    Your Application Status
                  </h3>
                  <div className="mb-3">
                    {getStatusBadge(registrationStatus)}
                  </div>
                  {isShortlisted && (
                    <div className="bg-green-100 p-3 rounded-md">
                      <p className="text-green-800 text-sm font-medium">
                        🎉 Congratulations! You've been shortlisted for the next round. Keep an eye on updates below.
                      </p>
                    </div>
                  )}
                  {isRejected && (
                    <div className="bg-red-100 p-3 rounded-md">
                      <p className="text-red-800 text-sm">
                        Unfortunately, you were not selected for this position. Don't worry, keep applying to other opportunities!
                      </p>
                    </div>
                  )}
                  {registrationStatus === 'registered' && (
                    <div className="bg-blue-100 p-3 rounded-md">
                      <p className="text-blue-800 text-sm">
                        Your application is under review. We'll notify you about any updates. Check the updates section below regularly.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <ClipboardCheck size={18} className="mr-2 text-green-600" />
                    Apply for This Position
                  </h3>
                  <p className="text-green-700 text-sm mb-4">
                    Register for this placement to receive updates and participate in the selection process.
                  </p>
                  <button 
                    onClick={handleRegisterClick}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <ClipboardCheck size={18} className="mr-2" />
                    Register for This Placement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Updates Section */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FileText size={20} className="mr-2 text-blue-600" />
              Placement Updates
              {updates.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {updates.length}
                </span>
              )}
            </h3>
            
            {!isRegistered ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertCircle size={24} className="text-yellow-600 mr-4 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Want to receive updates?</h4>
                    <p className="text-yellow-800 mb-4">
                      Register for this placement to receive important updates about interview rounds, selection process, and other announcements.
                    </p>
                    <button 
                      onClick={handleRegisterClick}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center font-medium"
                    >
                      <ClipboardCheck size={16} className="mr-2" />
                      Register Now to View Updates
                    </button>
                  </div>
                </div>
              </div>
            ) : updates.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No updates available yet.</p>
                <p className="text-gray-500 text-sm mt-2">
                  We'll notify you when there are new updates about this placement.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <div 
                    key={update._id || index} 
                    className={`bg-white p-6 rounded-lg border-l-4 shadow-sm ${
                      update.roundType === 'round-specific' 
                        ? 'border-l-green-500 bg-green-50' 
                        : 'border-l-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <FileText size={20} className={`mr-2 ${
                          update.roundType === 'round-specific' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                        <span className="font-semibold text-gray-800">
                          {update.roundType === 'round-specific' ? 'Round Specific Update' : 'General Update'}
                        </span>
                      </div>
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          update.roundType === 'round-specific' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {update.roundType === 'round-specific' ? 'Shortlisted Students' : 'All Applicants'}
                      </span>
                    </div>
                    
                    <div className="prose max-w-none mb-4">
                      <p className="text-gray-700 text-base leading-relaxed">{update.updateText}</p>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 pt-3 border-t border-gray-200">
                      <Clock size={14} className="mr-2" />
                      <span className="font-medium">{formatDateTime(update.datePosted)}</span>
                      {update.postedBy && (update.postedBy.name || update.postedBy.email) && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Posted by {update.postedBy.name || update.postedBy.email}</span>
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
  );
};

export default PlacementDetailPage;