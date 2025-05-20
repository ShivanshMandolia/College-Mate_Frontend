// src/features/admin/PlacementUpdate.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useAddPlacementUpdateMutation,
  useGetPlacementDetailsQuery 
} from '../../features/placements/placementsApiSlice';
import { 
  selectSelectedPlacement,
  setSelectedPlacement 
} from '../../features/placements/placementsSlice';
import { 
  Building2, 
  Briefcase, 
  AlertCircle, 
  Megaphone, 
  Users, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2,
  FileText,
  Save
} from 'lucide-react';

const PlacementUpdate = () => {
  const { placementId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get the selected placement from Redux
  const selectedPlacement = useSelector(selectSelectedPlacement);
  
  // Fetch placement details if not in Redux state
  const { 
    data: placementData, 
    isLoading: isLoadingPlacement 
  } = useGetPlacementDetailsQuery(placementId, {
    skip: !!selectedPlacement
  });
  
  // Set selected placement in Redux if it's not already there
  useEffect(() => {
    if (!selectedPlacement && placementData) {
      dispatch(setSelectedPlacement(placementData.data));
    }
  }, [placementData, selectedPlacement, dispatch]);
  
  // Get the placement to display
  const placement = selectedPlacement || (placementData ? placementData.data : null);
  
  // Form state
  const [updateText, setUpdateText] = useState('');
  const [roundType, setRoundType] = useState('common');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // API mutation
  const [addPlacementUpdate, { isLoading: isAddingUpdate, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useAddPlacementUpdateMutation();
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    try {
      await addPlacementUpdate({
        placementId,
        updateData: { updateText, roundType }
      }).unwrap();
      
      // Clear form
      setUpdateText('');
      
      // Wait a bit to show success message before navigating
      setTimeout(() => {
        navigate(`/admin/placements/${placementId}`);
      }, 1500);
    } catch (error) {
      console.error('Failed to add update:', error);
      // Error will be shown in the UI through the isUpdateError state
    }
  };
  
  // Reset form submitted state when loading state changes
  useEffect(() => {
    if (!isAddingUpdate && formSubmitted && !isUpdateError) {
      setFormSubmitted(false);
    }
  }, [isAddingUpdate, formSubmitted, isUpdateError]);
  
  if (isLoadingPlacement) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading placement...</p>
      </div>
    );
  }
  
  if (!placement) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-red-700">Error</h2>
        </div>
        <p className="text-red-600">Placement not found. The placement may have been deleted or you don't have access.</p>
        <button 
          onClick={() => navigate('/admin/placements')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Return to dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 py-8 px-4 shadow-md mb-8">
        <div className="container mx-auto">
          <button 
            onClick={() => navigate(`/admin/placements/${placementId}`)}
            className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to placement details
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Add Placement Update</h1>
          <div className="flex items-center text-emerald-100">
            <Building2 className="h-5 w-5 mr-2" />
            <span className="font-medium">{placement.companyName}</span>
            <span className="mx-2">•</span>
            <Briefcase className="h-5 w-5 mr-2" />
            <span>{placement.jobTitle}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          {isUpdateSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="text-green-700 font-medium">Update added successfully!</p>
                <p className="text-green-600 text-sm">Redirecting to placement details...</p>
              </div>
            </div>
          )}
          
          {isUpdateError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">Failed to add update</p>
                <p className="text-red-600 text-sm">{updateError?.data?.message || 'An error occurred. Please try again.'}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-700" />
              Create New Update
            </h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="roundType" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-indigo-500" />
                Update Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setRoundType('common')}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    roundType === 'common' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">Common Update</span>
                    <div className={`w-5 h-5 rounded-full border ${
                      roundType === 'common' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {roundType === 'common' && (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Visible to all registered students
                  </p>
                </div>
                
                <div 
                  onClick={() => setRoundType('round-specific')}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    roundType === 'round-specific' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">Round-Specific</span>
                    <div className={`w-5 h-5 rounded-full border ${
                      roundType === 'round-specific' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {roundType === 'round-specific' && (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Only visible to shortlisted students
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="updateText" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                Update Message
              </label>
              <textarea
                id="updateText"
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="8"
                placeholder="Enter your update message here..."
                required
              />
              <p className="text-gray-500 text-sm mt-2">
                Provide clear and concise information about the placement update.
              </p>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/admin/placements/${placementId}`)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAddingUpdate}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 disabled:bg-blue-400"
              >
                {isAddingUpdate ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting Update...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Post Update
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlacementUpdate;