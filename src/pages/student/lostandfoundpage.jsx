import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  useGetAllFoundItemsQuery,
  useGetAllLostRequestsQuery
} from '../../features/lostFound/lostFoundApiSlice';
import { Search, PlusCircle, Calendar, MapPin, Tag, Eye, Bookmark } from 'lucide-react';

const LostAndFoundPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('found');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Redux queries
  const { data: foundItems, isLoading: isLoadingFound } = useGetAllFoundItemsQuery();
  const { data: lostRequests, isLoading: isLoadingLost } = useGetAllLostRequestsQuery();

  // Format date string for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter items based on search term and category
  const filteredItems = (items = []) => {
    return items.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.landmark.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Render found items list
  const renderFoundItems = () => {
    if (isLoadingFound) return renderLoading();
    
    const items = filteredItems(foundItems?.data || []);
    
    if (items.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="bg-blue-50 inline-flex rounded-full p-4">
            <Search className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No found items match your search</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="relative">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-48 object-cover" 
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <Tag className="h-12 w-12 text-gray-300" />
                </div>
              )}
              <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                item.status === 'claimed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {item.status === 'claimed' ? 'Claimed' : 'Available'}
              </span>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{item.title}</h3>
              
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <Tag className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 line-clamp-1">{item.name}</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 line-clamp-1">{item.landmark}</p>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{formatDate(item.createdAt)}</p>
                </div>
              </div>
              
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{item.description}</p>
              
              {item.status !== 'claimed' && (
                <Link 
                  to={`/student/claim-item/${item._id}`} 
                  className="mt-4 w-full py-2 flex justify-center items-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details & Claim
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render lost item requests
  const renderLostRequests = () => {
    if (isLoadingLost) return renderLoading();
    
    const requests = filteredItems(lostRequests?.data || []);
    
    if (requests.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="bg-indigo-50 inline-flex rounded-full p-4">
            <Search className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No lost item requests match your search</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map(request => (
          <div key={request._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="relative">
              {request.imageUrl ? (
                <img 
                  src={request.imageUrl} 
                  alt={request.title}
                  className="w-full h-48 object-cover" 
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <Tag className="h-12 w-12 text-gray-300" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{request.title}</h3>
              
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <Tag className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 line-clamp-1">{request.name}</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 line-clamp-1">{request.landmark}</p>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
                </div>
              </div>
              
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{request.description}</p>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 flex items-center">
                  <Bookmark className="h-4 w-4 text-indigo-500 mr-2" />
                  If you found this item, please report it as found.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-2">Campus Lost & Found</h1>
              <p className="text-blue-100">Find your lost items or help others find theirs</p>
            </div>
            <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
              <Link 
                to="/student/post-found-item" 
                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Report Found Item
              </Link>
              <Link 
                to="/student/post-lost-item" 
                className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Report Lost Item
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* My Items Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link 
            to="/student/my-listings" 
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-4">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-lg text-gray-900">My Listings</h3>
                <p className="text-gray-500">Manage items you've found and reported</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/student/my-requests" 
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-lg p-4">
                <Bookmark className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-lg text-gray-900">My Requests</h3>
                <p className="text-gray-500">Manage your lost items and claims</p>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="md:flex md:items-center md:justify-between">
            <div className="relative flex-grow max-w-lg">
              <input
                type="text"
                placeholder="Search items by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="mt-3 md:mt-0 flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="documents">Documents</option>
                <option value="accessories">Accessories</option>
                <option value="clothing">Clothing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-1 mb-6 border border-gray-100">
          <div className="grid grid-cols-2">
            <button 
              onClick={() => setActiveTab('found')}
              className={`py-3 text-sm font-medium rounded-lg ${
                activeTab === 'found' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Found Items
            </button>
            <button 
              onClick={() => setActiveTab('lost')}
              className={`py-3 text-sm font-medium rounded-lg ${
                activeTab === 'lost' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Lost Item Requests
            </button>
          </div>
        </div>
        
        {/* Content based on active tab */}
        <div className="mb-6">
          {activeTab === 'found' && renderFoundItems()}
          {activeTab === 'lost' && renderLostRequests()}
        </div>
      </div>
    </div>
  );
};

export default LostAndFoundPage;