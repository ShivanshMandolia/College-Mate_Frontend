import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  useGetPlacementDetailsQuery,
  useRegisterForPlacementMutation 
} from '../../features/placements/placementsApiSlice';
import { 
  ArrowLeft, 
  Upload,
  Building,
  Briefcase,
  Calendar,
  FileText,
  Link2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star
} from 'lucide-react';

const PlacementRegistrationPage = () => {
  const { placementId } = useParams();
  const navigate = useNavigate();
  
  // Get placement details
  const { 
    data: placementResponse, 
    isLoading: isLoadingDetails, 
    isError: isDetailsError,
    error: detailsError
  } = useGetPlacementDetailsQuery(placementId);

  // Mutation for registration
  const [
    registerForPlacement, 
    { isLoading: isRegistering, isSuccess, isError: isRegisterError, error: registerError }
  ] = useRegisterForPlacementMutation();

  // Form state
  const [resumeFile, setResumeFile] = useState(null);
  const [googleFormLink, setGoogleFormLink] = useState('');
  const [formError, setFormError] = useState(null);

  // Redirect after successful registration
  useEffect(() => {
    if (isSuccess) {
      // Redirect to placement details page after successful registration
      setTimeout(() => {
        navigate(`/student/placements/${placementId}`);
      }, 2000);
    }
  }, [isSuccess, navigate, placementId]);

  // Extract data from response properly
  const placement = placementResponse?.data;
  
  // Check if already registered - properly handling the registration status
  const isAlreadyRegistered = placement?.registrationStatus && 
                             placement.registrationStatus !== 'not_registered';

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setResumeFile(file);
        setFormError(null);
      } else {
        setFormError('Please upload a PDF file for your resume');
        setResumeFile(null);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!resumeFile) {
      setFormError('Please upload your resume (PDF)');
      return;
    }

    if (!googleFormLink) {
      setFormError('Please provide the Google Form link');
      return;
    }

    try {
      // Create registration data according to the backend API expectations
      const registrationData = {
        googleFormLink: googleFormLink,
        resume: resumeFile
      };

      await registerForPlacement({
        placementId,
        registrationData
      }).unwrap();
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  // Loading state
  if (isLoadingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>
        
        <div className="flex justify-center items-center h-screen relative z-10">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
            </div>
            <p className="text-white/70 mt-6 text-lg">Loading placement details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state for loading details
  if (isDetailsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400/10 rounded-full blur-xl"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-indigo-400/10 rounded-full blur-xl"></div>
        </div>

        <div className="p-6 max-w-4xl mx-auto relative z-10 pt-20">
          <Link 
            to="/student/placements" 
            className="inline-flex items-center text-purple-400 mb-8 hover:text-purple-300 transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg">Back to Placements</span>
          </Link>
          
          <div className="bg-white/5 backdrop-blur-xl border border-red-400/30 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <XCircle size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Placement</h2>
            <p className="text-white/70 text-lg">{detailsError?.data?.message || 'Failed to load placement details'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Already registered state
  if (isAlreadyRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-orange-400/10 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="p-6 max-w-4xl mx-auto relative z-10 pt-20">
          <Link 
            to="/student/placements" 
            className="inline-flex items-center text-purple-400 mb-8 hover:text-purple-300 transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg">Back to Placements</span>
          </Link>
          
          <div className="bg-white/5 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Already Registered</h2>
            <p className="text-white/70 text-xl mb-8">You have already registered for this placement.</p>
            <Link 
              to={`/student/placements/${placementId}`}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 text-lg font-semibold"
            >
              View Placement Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-cyan-400/15 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="p-6 max-w-7xl mx-auto relative z-10 pt-12">
        <Link 
          to={`/student/placements/${placementId}`} 
          className="inline-flex items-center text-purple-400 mb-8 hover:text-purple-300 transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg font-medium">Back to Placement Details</span>
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-8 border-b border-white/10 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                <Star size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Register for Placement</h1>
                <h2 className="text-xl font-semibold text-purple-300 mt-1">
                  {placement?.companyName} - {placement?.jobTitle}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="col-span-1 lg:col-span-2">
              {isSuccess ? (
                <div className="bg-white/5 backdrop-blur-xl border border-green-400/30 rounded-3xl p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
                  <p className="text-white/70 text-lg mb-4">Your application has been submitted successfully.</p>
                  <p className="text-white/60">You'll be redirected to the placement details page shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Form errors */}
                  {(formError || isRegisterError) && (
                    <div className="bg-red-500/10 backdrop-blur-xl border border-red-400/30 text-red-300 px-6 py-4 rounded-2xl" role="alert">
                      <div className="flex items-center">
                        <XCircle size={20} className="mr-3 text-red-400" />
                        <div>
                          <strong className="font-semibold">Error: </strong>
                          <span>
                            {formError || registerError?.data?.message || 'Failed to register for placement'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resume Upload */}
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-white">Upload Resume (PDF)</label>
                    <div className="border-2 border-dashed border-white/20 hover:border-purple-400/50 rounded-2xl p-8 text-center cursor-pointer bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="resume" className="cursor-pointer flex flex-col items-center">
                        {resumeFile ? (
                          <>
                            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mb-4">
                              <FileText size={32} className="text-white" />
                            </div>
                            <p className="text-green-400 font-semibold text-lg">{resumeFile.name}</p>
                            <p className="text-white/60 mt-2">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                              <Upload size={32} className="text-white/60 group-hover:text-purple-400" />
                            </div>
                            <p className="text-white font-semibold text-lg">Click to upload your resume</p>
                            <p className="text-white/60 mt-2">PDF format only</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Roll Number Input */}
                  <div className="space-y-3">
                    <label htmlFor="googleFormLink" className="block text-lg font-semibold text-white">
                      Roll Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Link2 size={20} className="text-purple-400" />
                      </div>
                      <input
                        type="text"
                        id="googleFormLink"
                        value={googleFormLink}
                        onChange={(e) => setGoogleFormLink(e.target.value)}
                        placeholder="202XUCSXXX"
                        className="pl-12 w-full py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 text-lg"
                        required
                      />
                    </div>
                    <p className="text-white/60">
                      Enter your college roll number (format: 202XUCSXXX)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className={`w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 ${
                        isRegistering 
                          ? 'opacity-70 cursor-not-allowed' 
                          : 'hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-[1.02] hover:-translate-y-1'
                      }`}
                    >
                      {isRegistering ? (
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          Submitting Application...
                        </div>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Placement Info Sidebar */}
            <div className="col-span-1">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-6">
                <h3 className="text-xl font-bold text-white mb-6">Placement Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Building size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 font-medium mb-1">Company</p>
                      <p className="text-white text-lg font-semibold">{placement?.companyName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Briefcase size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 font-medium mb-1">Position</p>
                      <p className="text-white text-lg font-semibold">{placement?.jobTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 font-medium mb-1">Application Deadline</p>
                      <p className="text-white text-lg font-semibold">{new Date(placement?.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="font-semibold text-white mb-4 text-lg">Important Notes:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-white/70">Ensure your resume is up-to-date</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-white/70">Complete the Google Form thoroughly</span>
                    </div>
                    <div className="flex items-start">
                      <XCircle size={16} className="text-red-400 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-white/70">Applications cannot be edited after submission</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementRegistrationPage;