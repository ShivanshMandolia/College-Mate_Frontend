import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllPlacementsForStudentQuery } from '../../features/placements/placementsApiSlice';
import { Calendar, Building, Briefcase, ClipboardCheck, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlacements } from '../../features/placements/placementsSlice';

const StudentPlacementsPage = () => {
  const dispatch = useDispatch();
  const { data: apiResponse, isLoading, isError, error, refetch } = useGetAllPlacementsForStudentQuery();
  const [filter, setFilter] = useState('all');
  
  // Since transformResponse now returns the data array directly
  const placements = apiResponse || [];
  
  // Update Redux store when API data arrives
  useEffect(() => {
    if (placements.length > 0) {
      dispatch(setPlacements(placements));
    }
  }, [placements, dispatch]);
  
  // Force refetch when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  // Filter placements based on registration status
  const filteredPlacements = placements.filter(placement => {
    if (filter === 'all') return true;
    if (filter === 'registered') {
      return ['registered', 'shortlisted'].includes(placement.registrationStatus);
    }
    if (filter === 'not_registered') {
      return placement.registrationStatus === 'not_registered';
    }
    if (filter === 'shortlisted') {
      return placement.registrationStatus === 'shortlisted';
    }
    return true;
  });

  // Calculate counts for filter buttons
  const counts = {
    all: placements.length,
    registered: placements.filter(p => ['registered', 'shortlisted'].includes(p.registrationStatus)).length,
    shortlisted: placements.filter(p => p.registrationStatus === 'shortlisted').length,
    not_registered: placements.filter(p => p.registrationStatus === 'not_registered').length
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'registered':
        return 'bg-green-100 text-green-800';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'not_registered':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'registered':
        return 'Registered';
      case 'shortlisted':
        return 'Shortlisted';
      case 'rejected':
        return 'Rejected';
      case 'not_registered':
      default:
        return 'Not Registered';
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading your placements...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error?.data?.message || 'Failed to load placements'}</span>
        <button 
          onClick={handleRefresh}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Available Placements</h1>
          <p className="text-gray-600 mt-1">Manage your placement applications</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All ({counts.all})
        </button>
        <button 
          onClick={() => setFilter('not_registered')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'not_registered' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Available ({counts.not_registered})
        </button>
        <button 
          onClick={() => setFilter('registered')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'registered' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Applied ({counts.registered})
        </button>
        <button 
          onClick={() => setFilter('shortlisted')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'shortlisted' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Shortlisted ({counts.shortlisted})
        </button>
      </div>

      {/* Results */}
      {filteredPlacements.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 text-lg mb-2">
            {filter === 'all' 
              ? 'No placements available at the moment.' 
              : `No placements found for "${filter.replace('_', ' ')}" filter.`
            }
          </p>
          {filter !== 'all' && (
            <button 
              onClick={() => setFilter('all')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View all placements
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlacements.map((placement) => (
            <div 
              key={placement._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800 leading-tight">
                    {placement.companyName}
                  </h2>
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getStatusBadge(placement.registrationStatus)}`}
                  >
                    {getStatusText(placement.registrationStatus)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <Briefcase size={16} className="text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{placement.jobTitle}</span>
                  </div>
                  <div className="flex items-center">
                    <Building size={16} className="text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{placement.companyName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">
                      Deadline: {new Date(placement.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link 
                    to={`/student/placements/${placement._id}`}
                    className="flex items-center justify-center gap-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye size={14} />
                    <span>View Details</span>
                  </Link>
                  
                  {placement.registrationStatus === 'not_registered' ? (
                    <Link 
                      to={`/student/placements/${placement._id}/register`}
                      className="flex items-center justify-center gap-1 bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      <ClipboardCheck size={14} />
                      <span>Apply</span>
                    </Link>
                  ) : (
                    <button 
                      disabled
                      className="flex items-center justify-center gap-1 bg-gray-300 text-gray-600 py-2 px-3 rounded cursor-not-allowed text-sm"
                      title={`Status: ${getStatusText(placement.registrationStatus)}`}
                    >
                      <ClipboardCheck size={14} />
                      <span>{getStatusText(placement.registrationStatus)}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPlacementsPage;