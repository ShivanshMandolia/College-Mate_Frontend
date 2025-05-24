import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllComplaintsQuery, useSearchComplaintsQuery } from '../../features/complaints/complaintsApiSlice';
import { useDispatch } from 'react-redux';
import { setSelectedComplaint } from '../../features/complaints/complaintsSlice';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronDown, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from 'lucide-react';

const AdminComplaintsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Use the getAllComplaints query - this will only return complaints assigned to the admin
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
    navigate(`/admin/complaints/${complaint._id}`);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'pending':
          return { 
            gradient: 'linear-gradient(90deg, #facc15, #fb923c)',
            bgColor: 'rgba(251, 146, 60, 0.1)',
            icon: <Clock className="h-4 w-4 mr-1" />
          };
        case 'in-progress':
          return { 
            gradient: 'linear-gradient(90deg, #3b82f6, #6366f1)',
            bgColor: 'rgba(99, 102, 241, 0.1)',
            icon: <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          };
        case 'resolved':
          return { 
            gradient: 'linear-gradient(90deg, #10b981, #059669)',
            bgColor: 'rgba(16, 185, 129, 0.1)',
            icon: <CheckCircle className="h-4 w-4 mr-1" />
          };
        case 'rejected':
          return { 
            gradient: 'linear-gradient(90deg, #ef4444, #dc2626)',
            bgColor: 'rgba(239, 68, 68, 0.1)',
            icon: <XCircle className="h-4 w-4 mr-1" />
          };
        default:
          return { 
            gradient: 'linear-gradient(90deg, #6b7280, #4b5563)',
            bgColor: 'rgba(107, 114, 128, 0.1)',
            icon: <AlertCircle className="h-4 w-4 mr-1" />
          };
      }
    };
    
    const { gradient, bgColor, icon } = getStatusConfig();
    
    return (
      <span 
        className="flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white"
        style={{ 
          background: gradient,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 15px -5px rgba(0, 0, 0, 0.2)'
        }}
      >
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
      <div 
        className="min-h-screen flex justify-center items-center"
        style={{ background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)' }}
      >
        <div 
          className="p-8 rounded-3xl text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Loader2 
            className="h-12 w-12 mx-auto mb-4 animate-spin"
            style={{ color: '#c084fc' }}
          />
          <span className="text-slate-300 text-lg">Loading complaints...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div 
        className="min-h-screen flex justify-center items-center"
        style={{ background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)' }}
      >
        <div 
          className="p-8 rounded-3xl text-center max-w-md"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-red-400 font-semibold text-lg mb-2">Error loading complaints</h3>
          <p className="text-slate-300">{error?.data?.message || error?.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)' }}
    >
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-32 right-20 w-64 h-64 rounded-full animate-pulse opacity-30"
          style={{ background: 'rgba(147, 51, 234, 0.1)' }}
        ></div>
        <div 
          className="absolute bottom-20 left-32 w-48 h-48 rounded-full animate-pulse opacity-20"
          style={{ background: 'rgba(79, 70, 229, 0.1)' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center mb-6 lg:mb-0">
            <div 
              className="p-3 rounded-2xl mr-4"
              style={{
                background: 'linear-gradient(135deg, #9333ea, #db2777)',
                boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.3)'
              }}
            >
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 
                className="text-3xl lg:text-4xl font-bold mb-1"
                style={{
                  background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                My Assigned Complaints
              </h1>
              <p className="text-slate-300 text-lg">Manage and resolve student complaints</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-12 pr-4 py-3 rounded-2xl text-white placeholder-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: '300px'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
                </div>
              )}
            </div>
            
            {/* Filter Button */}
            <button 
              className="flex items-center justify-center px-6 py-3 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filter
              <ChevronDown 
                className={`h-4 w-4 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div 
            className="p-6 rounded-3xl mb-8 transition-all duration-500"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status Filter</label>
                <select
                  className="px-4 py-2 rounded-xl text-white border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all" style={{ background: '#1f2937' }}>All Status</option>
                  <option value="pending" style={{ background: '#1f2937' }}>Pending</option>
                  <option value="in-progress" style={{ background: '#1f2937' }}>In Progress</option>
                  <option value="resolved" style={{ background: '#1f2937' }}>Resolved</option>
                  <option value="rejected" style={{ background: '#1f2937' }}>Rejected</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Complaints Table */}
        <div 
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead 
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints && filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint, index) => (
                    <tr 
                      key={complaint._id} 
                      className="transition-all duration-300 hover:bg-white hover:bg-opacity-5"
                      style={{
                        borderBottom: index !== filteredComplaints.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-400">
                        {complaint._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white max-w-xs">
                        <div className="truncate">{complaint.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: 'rgba(168, 85, 247, 0.2)',
                            color: '#c084fc'
                          }}
                        >
                          {complaint.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {complaint.createdBy?.email || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(complaint)}
                          className="flex items-center px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                          style={{
                            background: 'linear-gradient(90deg, #9333ea, #4f46e5)',
                            boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.3)'
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <MessageSquare className="h-16 w-16 text-slate-400 mb-4 opacity-50" />
                        <p className="text-slate-300 text-lg font-medium mb-2">
                          {isLoading ? 'Loading complaints...' : 'No complaints assigned to you yet'}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {!isLoading && 'New complaints will appear here when assigned to you'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        {filteredComplaints && filteredComplaints.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="p-4 rounded-2xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-2xl font-bold text-white mb-1">{filteredComplaints.length}</div>
              <div className="text-slate-300 text-sm">Total Complaints</div>
            </div>
            <div 
              className="p-4 rounded-2xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-2xl font-bold text-white mb-1">
                {filteredComplaints.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-slate-300 text-sm">Pending</div>
            </div>
            <div 
              className="p-4 rounded-2xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-2xl font-bold text-white mb-1">
                {filteredComplaints.filter(c => c.status === 'in-progress').length}
              </div>
              <div className="text-slate-300 text-sm">In Progress</div>
            </div>
            <div 
              className="p-4 rounded-2xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-2xl font-bold text-white mb-1">
                {filteredComplaints.filter(c => c.status === 'resolved').length}
              </div>
              <div className="text-slate-300 text-sm">Resolved</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintsList;