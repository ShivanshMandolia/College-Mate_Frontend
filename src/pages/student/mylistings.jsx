import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  useGetMyFoundListingsQuery,
  useDeleteFoundItemMutation
} from '../../features/lostFound/lostFoundApiSlice';
import { Calendar, MapPin, Tag, Eye, Trash2, AlertCircle, ArrowLeft, Plus } from 'lucide-react';

const MyFoundListingsPage = () => {
  const [deleteAlert, setDeleteAlert] = useState({ show: false, itemId: null });
  
  const { 
    data: myFoundItems, 
    isLoading, 
    isError, 
    refetch 
  } = useGetMyFoundListingsQuery();
  
  const [deleteFoundItem, { isLoading: isDeleting }] = useDeleteFoundItemMutation();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteClick = (itemId) => {
    setDeleteAlert({ show: true, itemId });
  };

  const confirmDelete = async () => {
    try {
      await deleteFoundItem(deleteAlert.itemId).unwrap();
      refetch(); // Refresh the list after deletion
      setDeleteAlert({ show: false, itemId: null });
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const cancelDelete = () => {
    setDeleteAlert({ show: false, itemId: null });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400/30 border-t-purple-400"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="relative inline-flex">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-4 shadow-2xl">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-30"></div>
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">Error loading your listings</h3>
            <p className="mt-2 text-slate-300">There was a problem fetching your found item listings.</p>
            <button 
              onClick={refetch}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const items = myFoundItems?.data || [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link 
              to="/student/lost-found" 
              className="group flex items-center text-purple-400 hover:text-purple-300 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Lost and Found
            </Link>
            <div className="ml-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                My Found Item Listings
              </h1>
            </div>
          </div>
          
          {/* Empty State */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
              <div className="relative inline-flex mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-4 shadow-2xl">
                  <Tag className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur-xl opacity-30"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No found items posted yet</h3>
              <p className="text-slate-300 text-lg mb-8">When you post a found item, it will appear here.</p>
              <Link
                to="/student/post-found-item"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2 transform group-hover:rotate-90 transition-transform duration-300" />
                Post a Found Item
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/student/lost-found" 
            className="group flex items-center text-purple-400 hover:text-purple-300 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Lost and Found
          </Link>
          <div className="ml-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              My Found Item Listings
            </h1>
            <p className="text-slate-300 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>

        {/* Delete confirmation modal */}
        {deleteAlert.show && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative group max-w-md w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
                <p className="text-slate-300 mb-8">Are you sure you want to delete this found item listing? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={cancelDelete}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div 
              key={item._id} 
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-purple-500/50 transform hover:-translate-y-2 transition-all duration-500">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {item.imageUrl ? (
                    <>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <div className="relative">
                        <Tag className="h-16 w-16 text-purple-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-white mb-4 line-clamp-1 group-hover:text-purple-300 transition-colors duration-300">
                    {item.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-1.5 mr-3 flex-shrink-0">
                        <Tag className="h-3.5 w-3.5 text-white" />
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-1">{item.name}</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg p-1.5 mr-3 flex-shrink-0">
                        <MapPin className="h-3.5 w-3.5 text-white" />
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-1">{item.landmark}</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-1.5 mr-3 flex-shrink-0">
                        <Calendar className="h-3.5 w-3.5 text-white" />
                      </div>
                      <p className="text-sm text-slate-300">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2 mb-6 leading-relaxed">{item.description}</p>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to={`/student/found-item/${item._id}`}
                      className="group/btn flex items-center justify-center py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                    >
                      <Eye className="h-4 w-4 mr-2 transform group-hover/btn:scale-110 transition-transform duration-300" />
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="group/btn flex items-center justify-center py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium shadow-xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2 transform group-hover/btn:scale-110 transition-transform duration-300" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyFoundListingsPage;