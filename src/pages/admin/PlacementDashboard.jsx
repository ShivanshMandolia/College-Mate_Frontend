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
  FileDigit
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
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading placements...</p>
      </div>
    );
  }

  if (isPlacementsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <CircleAlert className="h-8 w-8 text-red-500" />
          <h2 className="text-xl font-semibold text-red-700">Error Loading Placements</h2>
        </div>
        <p className="text-red-600">{placementsError?.data?.message || placementsError?.message || 'Failed to load placements. Please try again later.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-4 shadow-md mb-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Placement Dashboard</h1>
          <p className="text-blue-100 max-w-2xl">
            Manage your assigned job placements and keep students updated with the latest information.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p><strong>Debug Info:</strong></p>
            <p>API Response Success: {String(placementsResponse?.success)}</p>
            <p>Placements Data Length: {placementsResponse?.data?.length || 0}</p>
            <p>Redux Placements Length: {placements?.length || 0}</p>
            <p>Filtered Placements Length: {filteredPlacements?.length || 0}</p>
          </div>
        )}

        {/* Search and filter section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or job title"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileDigit className="h-6 w-6 text-blue-600" />
          Your Assigned Placements ({filteredPlacements?.length || 0})
        </h2>
        
        {filteredPlacements && filteredPlacements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlacements.map((placement) => (
              <div 
                key={placement._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:translate-y-[-4px] border-t-4 border-blue-500"
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-800">{placement.companyName}</h2>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                    <p className="text-lg font-medium text-gray-700">{placement.jobTitle}</p>
                  </div>
                  
                  <div className="flex items-center mb-3 text-sm">
                    <Calendar className="h-4 w-4 text-red-500 mr-2" />
                    <span className="font-medium">Deadline:</span>
                    <span className="ml-1 text-gray-600">
                      {format(new Date(placement.deadline), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {placement.jobDescription ? 
                      placement.jobDescription.substring(0, 100) + '...' : 
                      'No description available'
                    }
                  </p>

                  {/* Status badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      placement.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {placement.status}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-between">
                  <button
                    onClick={() => handleViewDetails(placement)}
                    className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </button>
                  <button
                    onClick={() => handleAddUpdate(placement)}
                    className="flex items-center bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    <PenSquare className="h-4 w-4 mr-1" />
                    Add Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">
              {searchQuery ? 
                `No placements found matching "${searchQuery}"` : 
                "No placements are currently assigned to you."
              }
            </p>
            <p className="text-gray-500">
              {searchQuery ? 
                "Try adjusting your search terms." :
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