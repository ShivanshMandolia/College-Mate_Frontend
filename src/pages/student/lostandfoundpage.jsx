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
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-transparent bg-gradient-to-r from-purple-400 to-pink-400 animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-slate-900"></div>
      </div>
    </div>
  );

  const renderFoundItems = () => {
    if (isLoadingFound) return renderLoading();

    const items = filteredItems(foundItems?.data || []);

    if (items.length === 0) {
      return (
        <div className="text-center py-16">
          <div 
            className="inline-flex rounded-full p-6 mb-6"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(59, 130, 246, 0.30)'
            }}
          >
            <Search className="h-12 w-12 text-blue-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">No found items match your search</h3>
          <p className="text-slate-300 text-lg">Try adjusting your search or filter criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div 
            key={item._id} 
            className="group rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.50)';
              e.currentTarget.style.boxShadow = '0 32px 64px -12px rgba(59, 130, 246, 0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            }}
          >
            <div className="relative overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div 
                  className="w-full h-48 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.20), rgba(147, 51, 234, 0.20))'
                  }}
                >
                  <Tag className="h-16 w-16 text-blue-300" />
                </div>
              )}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.20), rgba(147, 51, 234, 0.20))'
                }}
              ></div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-xl text-white mb-4 line-clamp-1">{item.title}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-slate-300 text-sm line-clamp-1">{item.name}</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-slate-300 text-sm line-clamp-1">{item.landmark}</p>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-slate-300 text-sm">{formatDate(item.createdAt)}</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm line-clamp-2 mb-6">{item.description}</p>

              <Link
                to={`/student/found-item/${item._id}`}
                className="block w-full py-3 px-6 text-center text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6, #0891b2)',
                  boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(59, 130, 246, 0.40)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.25)';
                }}
              >
                <Eye className="h-5 w-5 mr-2 inline" />
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
          <div 
            className="inline-flex rounded-full p-6 mb-6"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(168, 85, 247, 0.30)'
            }}
          >
            <Search className="h-12 w-12 text-purple-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">No lost item requests match your search</h3>
          <p className="text-slate-300 text-lg">Try adjusting your search or filter criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div 
            key={item._id} 
            className="group rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.border = '1px solid rgba(168, 85, 247, 0.50)';
              e.currentTarget.style.boxShadow = '0 32px 64px -12px rgba(168, 85, 247, 0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            }}
          >
            <div className="relative overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div 
                  className="w-full h-48 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.20), rgba(79, 70, 229, 0.20))'
                  }}
                >
                  <Tag className="h-16 w-16 text-purple-300" />
                </div>
              )}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.20), rgba(79, 70, 229, 0.20))'
                }}
              ></div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-xl text-white mb-4 line-clamp-1">{item.title}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-slate-300 text-sm line-clamp-1">{item.name}</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-slate-300 text-sm line-clamp-1">{item.landmark}</p>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-pink-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-slate-300 text-sm">{formatDate(item.createdAt)}</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm line-clamp-2 mb-6">{item.description}</p>
              
              <Link
                to={`/student/lost-item/${item._id}`}
                className="block w-full py-3 px-6 text-center text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(90deg, #a855f7, #4f46e5)',
                  boxShadow: '0 20px 25px -5px rgba(168, 85, 247, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(168, 85, 247, 0.40)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(168, 85, 247, 0.25)';
                }}
              >
                <Eye className="h-5 w-5 mr-2 inline" />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
      }}
    >
      {/* Floating background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent)' }}
        ></div>
        <div 
          className="absolute top-40 right-32 w-96 h-96 rounded-full opacity-10 animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(79, 70, 229, 0.3), transparent)', animationDelay: '2s' }}
        ></div>
        <div 
          className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full opacity-15 animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)', animationDelay: '4s' }}
        ></div>
      </div>

      <div className="relative px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{
              background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Lost & Found
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Reunite with your belongings or help others find theirs
          </p>
        </div>

        {/* Main navigation tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
          <div 
            className="flex space-x-2 p-2 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}
          >
            <button
              onClick={() => setActiveTab('found')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'found' 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-300 hover:text-white'
              }`}
              style={activeTab === 'found' 
                ? { 
                    background: 'linear-gradient(90deg, #3b82f6, #0891b2)',
                    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.25)'
                  }
                : { background: 'transparent' }
              }
            >
              Found Items
            </button>
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'lost' 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-300 hover:text-white'
              }`}
              style={activeTab === 'lost' 
                ? { 
                    background: 'linear-gradient(90deg, #a855f7, #4f46e5)',
                    boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.25)'
                  }
                : { background: 'transparent' }
              }
            >
              Lost Items
            </button>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/student/post-found-item" 
              className="inline-flex items-center px-4 py-3 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(90deg, #10b981, #059669)',
                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(16, 185, 129, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.25)';
              }}
            >
              <Package className="h-5 w-5 mr-2" />
              Post Item
            </Link>
            
            <Link 
              to="/student/post-lost-item" 
              className="inline-flex items-center px-4 py-3 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(239, 68, 68, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(239, 68, 68, 0.25)';
              }}
            >
              <Newspaper className="h-5 w-5 mr-2" />
              Post Request
            </Link>
            
            <Link 
              to="/student/my-found-listings" 
              className="inline-flex items-center px-4 py-3 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(245, 158, 11, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(245, 158, 11, 0.25)';
              }}
            >
              <List className="h-5 w-5 mr-2" />
              My Found Items
            </Link>
            
            <Link 
              to="/student/my-lost-listings" 
              className="inline-flex items-center px-4 py-3 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(147, 51, 234, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(147, 51, 234, 0.25)';
              }}
            >
              <User className="h-5 w-5 mr-2" />
              My Lost Items
            </Link>
          </div>
        </div>

        {/* Search and filter */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Search by title, description, name, landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(147, 51, 234, 0.50)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(147, 51, 234, 0.10)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.10)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-6 py-4 rounded-2xl text-white transition-all duration-300 focus:outline-none focus:scale-[1.02]"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1px solid rgba(147, 51, 234, 0.50)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(147, 51, 234, 0.10)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="all" className="bg-slate-800">All Categories</option>
            <option value="electronics" className="bg-slate-800">Electronics</option>
            <option value="books" className="bg-slate-800">Books</option>
            <option value="clothing" className="bg-slate-800">Clothing</option>
            <option value="accessories" className="bg-slate-800">Accessories</option>
            <option value="documents" className="bg-slate-800">Documents</option>
            <option value="other" className="bg-slate-800">Other</option>
          </select>
        </div>

        {/* Main content */}
        {activeTab === 'found' ? renderFoundItems() : renderLostItems()}
      </div>
    </div>
  );
};

export default LostAndFoundPage;