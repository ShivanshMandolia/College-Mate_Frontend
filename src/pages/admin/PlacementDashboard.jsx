import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  useGetAllPlacementsForAdminQuery, 
} from '../../features/placements/placementsApiSlice';
import { 
  selectAllPlacements, 
  setSelectedPlacement,
  setPlacements
} from '../../features/placements/placementsSlice';
import { format } from 'date-fns';
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  Clock, 
  Eye, 
  PenSquare, 
  Search, 
  CircleAlert, 
  Loader2,
  FileDigit,
  Sparkles
} from 'lucide-react';

const PlacementDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch placements assigned to admin
  const { 
    data: placementsResponse, 
    isLoading: isLoadingPlacements, 
    isError: isPlacementsError,
    error: placementsError 
  } = useGetAllPlacementsForAdminQuery();
  
  console.log("Full API Response:", placementsResponse);
  console.log("🚀 placementsResponse:", placementsResponse);
  console.log("📦 isLoading:", isLoadingPlacements);
  console.log("❌ isError:", isPlacementsError);
  console.log("⚠️ error:", placementsError);
  
  // Update Redux store when data is fetched
  useEffect(() => {
    // The response structure is: { statusCode: 200, data: [...], message: "...", success: true }
    if (placementsResponse?.success && placementsResponse?.data) {
      console.log("Setting placements in Redux:", placementsResponse.data);
      dispatch(setPlacements(placementsResponse.data));
    }
  }, [placementsResponse, dispatch]);
  
  // Get placements from Redux store
  const placements = useSelector(selectAllPlacements);
  console.log("Placements from Redux:", placements);

  // Filter placements based on search query
  const filteredPlacements = placements?.filter(placement => 
    placement.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    placement.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  console.log("Filtered placements:", filteredPlacements);

  // Handle navigation to placement details
  const handleViewDetails = (placement) => {
    dispatch(setSelectedPlacement(placement));
    navigate(`/admin/placements/${placement._id}`);
  };

  // Handle navigation to update placement
  const handleAddUpdate = (placement) => {
    dispatch(setSelectedPlacement(placement));
    navigate(`/admin/placements/${placement._id}/update`);
  };

  if (isLoadingPlacements) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
        }}
      >
        <div 
          className="text-center p-12 rounded-3xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <div className="relative mb-6">
            <div 
              className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #9333ea, #db2777, #4f46e5)',
                boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.25)'
              }}
            >
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Placements</h2>
          <p className="text-slate-300">Fetching your assigned placements...</p>
        </div>
      </div>
    );
  }

  if (isPlacementsError) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
        }}
      >
        <div 
          className="max-w-2xl w-full p-8 rounded-3xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(239, 68, 68, 0.30)',
            boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.10)'
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              }}
            >
              <CircleAlert className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Error Loading Placements</h2>
              <p className="text-slate-300">Something went wrong while fetching data</p>
            </div>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {placementsError?.data?.message || placementsError?.message || 'Failed to load placements. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-16"
      style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
      }}
    >
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 animate-pulse"
            style={{ background: 'radial-gradient(circle, #9333ea, transparent)' }}
          ></div>
          <div 
            className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-15 animate-pulse"
            style={{ background: 'radial-gradient(circle, #4f46e5, transparent)', animationDelay: '1s' }}
          ></div>
          <div 
            className="absolute bottom-20 left-1/3 w-20 h-20 rounded-full opacity-10 animate-pulse"
            style={{ background: 'radial-gradient(circle, #db2777, transparent)', animationDelay: '2s' }}
          ></div>
        </div>

        <div className="relative py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="mb-6">
              <div 
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #db2777, #4f46e5)',
                  boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.25)'
                }}
              >
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 
              className="text-5xl md:text-7xl font-bold mb-4"
              style={{
                background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Placement Dashboard
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Manage your assigned job placements and keep students updated with the latest opportunities.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Search Section */}
        <div 
          className="mb-12 p-6 rounded-3xl border transition-all duration-500 hover:border-purple-500/50"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <div className="relative">
            <div 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #4f46e5)',
              }}
            >
              <Search className="h-5 w-5 text-white" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or job title..."
              className="pl-16 pr-6 py-4 w-full rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.20)',
              }}
            />
          </div>
        </div>

        {/* Header with Count */}
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #2563eb)',
            }}
          >
            <FileDigit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Your Assigned Placements</h2>
            <p className="text-slate-300">
              {filteredPlacements?.length || 0} placement{filteredPlacements?.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
        
        {filteredPlacements && filteredPlacements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlacements.map((placement, index) => (
              <div 
                key={placement._id}
                className="group rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                  animationDelay: `${index * 100}ms`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(147, 51, 234, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div className="p-8">
                  {/* Company Header */}
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #a855f7, #4f46e5)',
                      }}
                    >
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                      {placement.companyName}
                    </h3>
                  </div>
                  
                  {/* Job Title */}
                  <div className="flex items-center mb-4">
                    <Briefcase className="h-5 w-5 text-slate-400 mr-3" />
                    <p className="text-lg font-semibold text-slate-300">{placement.jobTitle}</p>
                  </div>
                  
                  {/* Deadline */}
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-pink-400 mr-3" />
                    <div className="text-sm">
                      <span className="text-slate-400">Deadline: </span>
                      <span className="text-white font-medium">
                        {format(new Date(placement.deadline), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                    {placement.jobDescription ? 
                      placement.jobDescription.substring(0, 120) + '...' : 
                      'No description available'
                    }
                  </p>

                  {/* Status Badge */}
                  <div className="mb-6">
                    <span 
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        placement.status === 'open' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {placement.status}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div 
                  className="p-6 flex gap-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <button
                    onClick={() => handleViewDetails(placement)}
                    className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    style={{
                      background: 'linear-gradient(90deg, #6366f1, #2563eb)',
                      boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.25)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 20px 40px -10px rgba(99, 102, 241, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 10px 25px -5px rgba(99, 102, 241, 0.25)';
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </button>
                  <button
                    onClick={() => handleAddUpdate(placement)}
                    className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    style={{
                      background: 'linear-gradient(90deg, #059669, #047857)',
                      boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.25)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 20px 40px -10px rgba(5, 150, 105, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 10px 25px -5px rgba(5, 150, 105, 0.25)';
                    }}
                  >
                    <PenSquare className="h-4 w-4 mr-2" />
                    Add Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="p-16 rounded-3xl border text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
            }}
          >
            <div 
              className="w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              }}
            >
              <Clock className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {searchQuery ? 
                `No placements found matching "${searchQuery}"` : 
                "No placements are currently assigned to you."
              }
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
              {searchQuery ? 
                "Try adjusting your search terms to find what you're looking for." :
                "New assignments will appear here when they are assigned to you by a superadmin."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementDashboard;