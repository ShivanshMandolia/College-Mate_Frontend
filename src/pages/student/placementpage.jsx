import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllPlacementsForStudentQuery } from '../../features/placements/placementsApiSlice';
import { Calendar, Building, Briefcase, ClipboardCheck, Eye, RefreshCw } from 'lucide-react';
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
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/25';
      case 'shortlisted':
        return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-500/25';
      case 'rejected':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg shadow-red-500/25';
      case 'not_registered':
      default:
        return 'bg-white/10 backdrop-blur-sm border border-white/20 text-slate-300';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-400/30 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-300 text-lg font-medium">Loading your placements...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex justify-center items-center p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-red-500/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h2>
            <p className="text-slate-300 mb-6">{error?.data?.message || 'Failed to load placements'}</p>
            <button 
              onClick={handleRefresh}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 ease-out"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
              Available Placements
            </h1>
            <p className="text-xl text-slate-300 font-medium">Manage your placement applications with ease</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 ease-out flex items-center gap-3"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { key: 'all', label: 'All', count: counts.all, gradient: 'from-purple-600 to-indigo-600' },
            { key: 'not_registered', label: 'Available', count: counts.not_registered, gradient: 'from-indigo-600 to-blue-600' },
            { key: 'registered', label: 'Applied', count: counts.registered, gradient: 'from-blue-600 to-cyan-600' },
            { key: 'shortlisted', label: 'Shortlisted', count: counts.shortlisted, gradient: 'from-violet-600 to-purple-600' }
          ].map(({ key, label, count, gradient }) => (
            <button 
              key={key}
              onClick={() => setFilter(key)}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ease-out transform hover:scale-105 ${
                filter === key 
                  ? `bg-gradient-to-r ${gradient} text-white shadow-xl shadow-purple-500/25` 
                  : 'bg-white/10 backdrop-blur-sm border border-white/20 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Results */}
        {filteredPlacements.length === 0 ? (
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl mx-auto mb-8 flex items-center justify-center opacity-80">
              <Briefcase size={48} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {filter === 'all' 
                ? 'No placements available at the moment' 
                : `No placements found for "${filter.replace('_', ' ')}" filter`
              }
            </h3>
            <p className="text-slate-300 text-lg mb-8">Check back later for new opportunities!</p>
            {filter !== 'all' && (
              <button 
                onClick={() => setFilter('all')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
              >
                View all placements
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlacements.map((placement) => (
              <div 
                key={placement._id} 
                className="group bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl hover:bg-slate-800 hover:border-purple-500/50 hover:shadow-purple-500/20 hover:-translate-y-2 transition-all duration-500 ease-out"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white leading-tight group-hover:text-purple-300 transition-colors duration-300">
                      {placement.companyName}
                    </h2>
                    <span 
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ml-3 ${getStatusBadge(placement.registrationStatus)} transition-all duration-300`}
                    >
                      {getStatusText(placement.registrationStatus)}
                    </span>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center group/item">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                        <Briefcase size={18} className="text-white" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white transition-colors duration-300">{placement.jobTitle}</span>
                    </div>
                    <div className="flex items-center group/item">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                        <Building size={18} className="text-white" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white transition-colors duration-300">{placement.companyName}</span>
                    </div>
                    <div className="flex items-center group/item">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                        <Calendar size={18} className="text-white" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white transition-colors duration-300">
                        Deadline: {new Date(placement.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <Link 
                      to={`/student/placements/${placement._id}`}
                      className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-4 rounded-xl hover:bg-white/20 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-sm"
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                    </Link>
                    
                    {placement.registrationStatus === 'not_registered' ? (
                      <Link 
                        to={`/student/placements/${placement._id}/register`}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 font-medium text-sm"
                      >
                        <ClipboardCheck size={16} />
                        <span>Apply</span>
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-500 py-3 px-4 rounded-xl cursor-not-allowed font-medium text-sm"
                        title={`Status: ${getStatusText(placement.registrationStatus)}`}
                      >
                        <ClipboardCheck size={16} />
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
    </div>
  );
};

export default StudentPlacementsPage;