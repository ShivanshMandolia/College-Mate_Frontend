import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllComplaintsQuery, useSearchComplaintsQuery } from '../../features/complaints/complaintsApiSlice';
import { useDispatch } from 'react-redux';
import { setSelectedComplaint } from '../../features/complaints/complaintsSlice';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronDown, 
  EyeIcon, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from 'lucide-react';

const ComplaintsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Use the getAllComplaints query
  const { 
    data: complaintsResponse, 
    isLoading, 
    isError, 
    error 
  } = useGetAllComplaintsQuery();
  
  // Extract complaints from the response
  const complaints = complaintsResponse?.data || [];
  
  // Search query (only triggered when searchTerm is not empty)
  const { 
    data: searchResponse, 
    isLoading: isSearching 
  } = useSearchComplaintsQuery(searchTerm, { 
    skip: !searchTerm
  });
  
  // Extract search results from the response
  const searchResults = searchResponse?.data || [];
  
  // Use useMemo to compute filtered complaints instead of useEffect + state
  const filteredComplaints = useMemo(() => {
    const baseComplaints = searchTerm ? searchResults : complaints;
    
    if (statusFilter === 'all') {
      return baseComplaints;
    }
    
    return baseComplaints.filter(complaint => complaint.status === statusFilter);
  }, [complaints, searchResults, statusFilter, searchTerm]);
  
  // Handle view details
  const handleViewDetails = (complaint) => {
    dispatch(setSelectedComplaint(complaint));
    navigate(`/superadmin/complaints/${complaint._id}`);
  };

  // Status badge component with College Mate styling
  const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'pending':
          return { 
            gradient: 'bg-gradient-to-r from-yellow-400 to-orange-400',
            textColor: 'text-white',
            glowColor: 'shadow-lg shadow-yellow-400/25',
            icon: <Clock className="h-3 w-3 mr-1" />
          };
        case 'in-progress':
          return { 
            gradient: 'bg-gradient-to-r from-blue-400 to-cyan-600',
            textColor: 'text-white',
            glowColor: 'shadow-lg shadow-blue-400/25',
            icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          };
        case 'resolved':
          return { 
            gradient: 'bg-gradient-to-r from-violet-500 to-purple-600',
            textColor: 'text-white',
            glowColor: 'shadow-lg shadow-purple-500/25',
            icon: <CheckCircle className="h-3 w-3 mr-1" />
          };
        case 'rejected':
          return { 
            gradient: 'bg-gradient-to-r from-pink-400 to-pink-600',
            textColor: 'text-white',
            glowColor: 'shadow-lg shadow-pink-400/25',
            icon: <XCircle className="h-3 w-3 mr-1" />
          };
        default:
          return { 
            gradient: 'bg-gradient-to-r from-slate-400 to-slate-500',
            textColor: 'text-white',
            glowColor: 'shadow-lg shadow-slate-400/25',
            icon: <AlertCircle className="h-3 w-3 mr-1" />
          };
      }
    };
    
    const { gradient, textColor, glowColor, icon } = getStatusConfig();
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${gradient} ${textColor} ${glowColor} transition-all duration-300 hover:scale-105`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')}
      </span>
    );
  };

  // Format date in a readable way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
      }}>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center px-8 py-4 rounded-2xl backdrop-blur-md border border-white/10" 
               style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
            <span className="ml-3 text-white font-medium">Loading complaints...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
      }}>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center px-8 py-6 rounded-2xl backdrop-blur-md border border-pink-500/30"
               style={{ 
                 background: 'rgba(219, 39, 119, 0.1)',
                 boxShadow: '0 25px 50px -12px rgba(219, 39, 119, 0.1)'
               }}>
            <AlertCircle className="h-8 w-8 text-pink-400" />
            <div className="ml-4">
              <h3 className="text-white font-semibold">Error loading complaints</h3>
              <p className="text-slate-300 mt-1">{error?.data?.message || error?.message || 'Something went wrong'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging to help troubleshoot
  console.log('Complaints response:', complaintsResponse);
  console.log('Extracted complaints:', complaints);
  console.log('Search response:', searchResponse);
  console.log('Extracted search results:', searchResults);
  console.log('Filtered complaints:', filteredComplaints);

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/25"
                 style={{ background: 'linear-gradient(135deg, #9333ea, #db2777)' }}>
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Complaints Management</h1>
              <p className="text-slate-300">Manage and track all student complaints</p>
            </div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-12 pr-4 py-3 w-80 rounded-2xl backdrop-blur-md border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
                </div>
              )}
            </div>
            
            <button 
              className="flex items-center px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 text-white hover:border-purple-500/50 hover:scale-105 transition-all duration-300"
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 rounded-2xl backdrop-blur-md border border-white/10 transition-all duration-500"
               style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Status Filter</label>
                <select
                  className="px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                  style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all" className="bg-slate-800">All Status</option>
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="in-progress" className="bg-slate-800">In Progress</option>
                  <option value="resolved" className="bg-slate-800">Resolved</option>
                  <option value="rejected" className="bg-slate-800">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Complaints Table */}
        <div className="rounded-3xl backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl"
             style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredComplaints && filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint, index) => (
                    <tr key={complaint._id} 
                        className="hover:bg-white/5 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 100}ms` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-lg">
                          {complaint._id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                          {complaint.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-300 bg-white/5 px-3 py-1 rounded-lg">
                          {complaint.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {complaint.createdBy?.email || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(complaint)}
                          className="flex items-center px-4 py-2 rounded-xl font-semibold text-white hover:scale-105 transition-all duration-300 shadow-lg"
                          style={{ 
                            background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                            boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.2)'
                          }}
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <MessageSquare className="h-16 w-16 text-slate-500 mb-4" />
                        <p className="text-slate-400 text-lg font-medium">
                          {isLoading ? 'Loading complaints...' : 'No complaints found'}
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                          {searchTerm ? 'Try adjusting your search terms' : 'New complaints will appear here'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-pulse"
               style={{ background: 'rgba(147, 51, 234, 0.2)' }}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 rounded-full animate-pulse"
               style={{ background: 'rgba(79, 70, 229, 0.2)' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full animate-pulse"
               style={{ background: 'rgba(59, 130, 246, 0.1)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsList;