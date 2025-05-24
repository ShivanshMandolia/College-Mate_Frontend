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
  Save,
  Sparkles,
  Globe
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
      <div className="min-h-screen flex flex-col items-center justify-center" 
           style={{
             background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
           }}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <Loader2 className="h-16 w-16 text-purple-400 animate-spin mb-6 mx-auto" />
            <p className="text-xl text-white font-medium">Loading placement details...</p>
            <p className="text-slate-300 mt-2">Please wait while we fetch the information</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!placement) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
           style={{
             background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
           }}>
        <div className="max-w-md w-full">
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Placement Not Found</h2>
            <p className="text-slate-300 mb-8">The placement may have been deleted or you don't have access to view it.</p>
            <button 
              onClick={() => navigate('/admin/placements')}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ArrowLeft className="h-5 w-5" />
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen"
         style={{
           background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
         }}>
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-600/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <button 
            onClick={() => navigate(`/admin/placements/${placementId}`)}
            className="group flex items-center text-slate-300 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
          >
            <div className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center mr-3 group-hover:bg-white/10 group-hover:border-purple-500/30 transition-all duration-300">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Back to placement details</span>
          </button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              <FileText className="h-8 w-8 text-purple-400" />
              <h1 className="text-5xl md:text-7xl font-bold">Add Update</h1>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 inline-flex items-center gap-4 mt-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-xl">{placement.companyName}</p>
                <div className="flex items-center text-slate-300 gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{placement.jobTitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            
            {/* Success Message */}
            {isUpdateSuccess && (
              <div className="mb-8 p-6 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-green-300 font-bold text-lg">Update Posted Successfully!</p>
                    <p className="text-green-400">Redirecting to placement details...</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {isUpdateError && (
              <div className="mb-8 p-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-red-300 font-bold text-lg">Failed to Add Update</p>
                    <p className="text-red-400">{updateError?.data?.message || 'An error occurred. Please try again.'}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Update Type Selection */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Update Type</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => setRoundType('common')}
                    className={`group cursor-pointer transition-all duration-500 hover:scale-105 ${
                      roundType === 'common' 
                        ? 'bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-purple-500/50 shadow-2xl shadow-purple-500/20' 
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                    } backdrop-blur-xl border rounded-2xl p-6`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          roundType === 'common' 
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                            : 'bg-white/10 group-hover:bg-white/20'
                        } transition-all duration-300`}>
                          <Globe className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">Common Update</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        roundType === 'common' 
                          ? 'border-purple-400 bg-purple-400' 
                          : 'border-white/30'
                      } transition-all duration-300`}>
                        {roundType === 'common' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Visible to all registered students in the placement portal
                    </p>
                  </div>
                  
                  <div 
                    onClick={() => setRoundType('round-specific')}
                    className={`group cursor-pointer transition-all duration-500 hover:scale-105 ${
                      roundType === 'round-specific' 
                        ? 'bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 border-indigo-500/50 shadow-2xl shadow-indigo-500/20' 
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                    } backdrop-blur-xl border rounded-2xl p-6`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          roundType === 'round-specific' 
                            ? 'bg-gradient-to-br from-indigo-600 to-cyan-600' 
                            : 'bg-white/10 group-hover:bg-white/20'
                        } transition-all duration-300`}>
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">Round-Specific</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        roundType === 'round-specific' 
                          ? 'border-indigo-400 bg-indigo-400' 
                          : 'border-white/30'
                      } transition-all duration-300`}>
                        {roundType === 'round-specific' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Only visible to shortlisted students for this round
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Update Message */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Update Message</h3>
                </div>
                
                <div className="relative">
                  <textarea
                    id="updateText"
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
                    rows="10"
                    placeholder="Enter your update message here... Provide clear and detailed information about the placement update."
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <p className="text-slate-400 text-sm mt-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Write a comprehensive update that will help students understand the current status
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/placements/${placementId}`)}
                  className="flex-1 sm:flex-none px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-2xl hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 font-semibold"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isAddingUpdate}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isAddingUpdate ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Posting Update...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Post Update
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementUpdate;