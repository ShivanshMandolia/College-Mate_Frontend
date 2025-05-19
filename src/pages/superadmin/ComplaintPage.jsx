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

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'pending':
          return { 
            color: 'bg-yellow-100 text-yellow-800', 
            icon: <Clock className="h-4 w-4 mr-1" />
          };
        case 'in-progress':
          return { 
            color: 'bg-blue-100 text-blue-800', 
            icon: <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          };
        case 'resolved':
          return { 
            color: 'bg-green-100 text-green-800', 
            icon: <CheckCircle className="h-4 w-4 mr-1" />
          };
        case 'rejected':
          return { 
            color: 'bg-red-100 text-red-800', 
            icon: <XCircle className="h-4 w-4 mr-1" />
          };
        default:
          return { 
            color: 'bg-gray-100 text-gray-800', 
            icon: <AlertCircle className="h-4 w-4 mr-1" />
          };
      }
    };
    
    const { color, icon } = getStatusConfig();
    
    return (
      <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading complaints...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-50 rounded-lg p-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
        <div className="ml-3">
          <h3 className="text-red-800 font-medium">Error loading complaints</h3>
          <p className="text-red-700 mt-1">{error?.data?.message || error?.message || 'Something went wrong'}</p>
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaints Management</h1>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search complaints..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
          <button 
            className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredComplaints && filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                      {complaint._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {complaint.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {complaint.createdBy?.email || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(complaint.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(complaint)}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {isLoading ? 'Loading complaints...' : 'No complaints found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsList;