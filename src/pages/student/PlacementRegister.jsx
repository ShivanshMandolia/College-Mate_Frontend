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
  AlertTriangle
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
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state for loading details
  if (isDetailsError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Link to="/student/placements" className="flex items-center text-blue-600 mb-6 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to Placements
        </Link>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {detailsError?.data?.message || 'Failed to load placement details'}</span>
        </div>
      </div>
    );
  }

  // Already registered state
  if (isAlreadyRegistered) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Link to="/student/placements" className="flex items-center text-blue-600 mb-6 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to Placements
        </Link>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Already Registered</h2>
          <p className="text-gray-600 mb-4">You have already registered for this placement.</p>
          <Link 
            to={`/student/placements/${placementId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Placement Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Link to={`/student/placements/${placementId}`} className="flex items-center text-blue-600 mb-6 hover:underline">
        <ArrowLeft size={16} className="mr-1" />
        Back to Placement Details
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Register for Placement</h1>
          <h2 className="text-xl font-semibold text-gray-700 mt-1">{placement?.companyName} - {placement?.jobTitle}</h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="col-span-1 md:col-span-2">
            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
                <p className="text-gray-600 mb-4">Your application has been submitted successfully.</p>
                <p className="text-gray-600">You'll be redirected to the placement details page shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Form errors */}
                {(formError || isRegisterError) && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">
                      {formError || registerError?.data?.message || 'Failed to register for placement'}
                    </span>
                  </div>
                )}

                {/* Resume Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
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
                          <FileText size={36} className="text-green-500 mb-2" />
                          <p className="text-green-600 font-medium">{resumeFile.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <Upload size={36} className="text-gray-400 mb-2" />
                          <p className="text-gray-600 font-medium">Click to upload your resume</p>
                          <p className="text-sm text-gray-500 mt-1">PDF format only</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

               {/* Roll Number Input (still stored as googleFormLink in backend) */}
<div className="mb-6">
  <label htmlFor="googleFormLink" className="block text-sm font-medium text-gray-700 mb-2">
    Roll Number
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Link2 size={18} className="text-gray-400" />
    </div>
    <input
      type="text"
      id="googleFormLink"
      value={googleFormLink}
      onChange={(e) => setGoogleFormLink(e.target.value)}
      placeholder="202XUCSXXX"
      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      required
    />
  </div>
  <p className="mt-1 text-sm text-gray-500">
    Enter your college roll number (format: 202XUCSXXX)
  </p>
</div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isRegistering ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isRegistering ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
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
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Placement Information</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Building size={18} className="text-blue-600 mr-2 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Company</p>
                    <p className="text-gray-800">{placement?.companyName}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Briefcase size={18} className="text-blue-600 mr-2 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Position</p>
                    <p className="text-gray-800">{placement?.jobTitle}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Calendar size={18} className="text-blue-600 mr-2 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Application Deadline</p>
                    <p className="text-gray-800">{new Date(placement?.deadline).toLocaleDateString()}</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">Important Notes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle size={14} className="text-green-500 mr-2 mt-1" />
                    <span>Ensure your resume is up-to-date</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={14} className="text-green-500 mr-2 mt-1" />
                    <span>Complete the Google Form thoroughly</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle size={14} className="text-red-500 mr-2 mt-1" />
                    <span>Applications cannot be edited after submission</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementRegistrationPage;