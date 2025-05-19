import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllFoundItemsQuery,
  useGetAllLostItemsQuery
} from '../../features/lostFound/lostFoundApiSlice';
import { Search, Calendar, MapPin, Tag, Eye, Package, Newspaper, User, List } from 'lucide-react';

const LostAndFoundPage = () => {
  const [activeTab, setActiveTab] = useState('found');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: foundItems, isLoading: isLoadingFound } = useGetAllFoundItemsQuery();
  const { data: lostItems, isLoading: isLoadingLost } = useGetAllLostItemsQuery();

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

              <Link
                to={`/student/found-item/${item._id}`}
                className="mt-4 w-full py-2 flex justify-center items-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLostItems = () => {
    if (isLoadingLost) return renderLoading();

    const items = filteredItems(lostItems?.data || []);

    if (items.length === 0) {
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
              
              <Link
                to={`/student/lost-item/${item._id}`}
                className="mt-4 w-full py-2 flex justify-center items-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      {/* Main navigation tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
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
            Lost Items
          </button>
        </div>
        
        {/* Action buttons - keeping the original four buttons as requested */}
        <div className="flex flex-wrap gap-2">
          <Link 
            to="/student/post-found-item" 
            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Package className="h-4 w-4 mr-1" />
            Post Item
          </Link>
          
          <Link 
            to="/student/post-lost-item" 
            className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <Newspaper className="h-4 w-4 mr-1" />
            Post Request
          </Link>
          
          <Link 
            to="/student/my-found-listings" 
            className="inline-flex items-center px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
          >
            <List className="h-4 w-4 mr-1" />
            My Found Items
          </Link>
          
          <Link 
            to="/student/my-lost-listings" 
            className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <User className="h-4 w-4 mr-1" />
            My Lost Items
          </Link>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <option value="documents">Documents</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Main content */}
      {activeTab === 'found' ? renderFoundItems() : renderLostItems()}
    </div>
  );
};



export default LostAndFoundPage;