import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllFoundItemsQuery,
  useGetAllLostRequestsQuery
} from '../../features/lostFound/lostFoundApiSlice';
import { Search, PlusCircle, Calendar, MapPin, Tag, Eye, Bookmark } from 'lucide-react';

const LostAndFoundPage = () => {
  const [activeTab, setActiveTab] = useState('found');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: foundItems, isLoading: isLoadingFound } = useGetAllFoundItemsQuery();
  const { data: lostRequests, isLoading: isLoadingLost } = useGetAllLostRequestsQuery();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredItems = (items = []) => {
    return items.filter(item => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch =
        (item.title?.toLowerCase().includes(lowerSearch)) ||
        (item.description?.toLowerCase().includes(lowerSearch)) ||
        (item.name?.toLowerCase().includes(lowerSearch)) ||
        (item.landmark?.toLowerCase().includes(lowerSearch));

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

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
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('found')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'found' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Found Items
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'lost' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Lost Requests
          </button>
        </div>
        <Link to="/student/report-item" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <PlusCircle className="h-4 w-4 mr-2" />
          Report Item
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by title, description, name, landmark..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {activeTab === 'found' ? renderFoundItems() : renderLostRequests()}
    </div>
  );
};

export default LostAndFoundPage;
