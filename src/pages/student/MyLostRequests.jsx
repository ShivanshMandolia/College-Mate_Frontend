import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  useGetMyLostListingsQuery,
  useDeleteLostItemMutation
} from '../../features/lostFound/lostFoundApiSlice';
import { Calendar, MapPin, Tag, Eye, Trash2, AlertCircle } from 'lucide-react';

const MyLostListingsPage = () => {
  const [deleteAlert, setDeleteAlert] = useState({ show: false, itemId: null });
  
  const { 
    data: myLostItems, 
    isLoading, 
    isError, 
    refetch 
  } = useGetMyLostListingsQuery();
  
  const [deleteLostItem, { isLoading: isDeleting }] = useDeleteLostItemMutation();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteClick = (itemId) => {
    setDeleteAlert({ show: true, itemId });
  };

  const confirmDelete = async () => {
    try {
      await deleteLostItem(deleteAlert.itemId).unwrap();
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 inline-flex rounded-full p-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading your requests</h3>
        <p className="mt-2 text-gray-500">There was a problem fetching your lost item requests.</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const items = myLostItems?.data || [];

  if (items.length === 0) {
    return (
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Link 
            to="/student/lost-found" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            &larr; Back to Lost and Found
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">My Lost Item Requests</h1>
        </div>
        
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-indigo-50 inline-flex rounded-full p-4">
            <Tag className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No lost item requests posted yet</h3>
          <p className="mt-2 text-gray-500">When you post a lost item request, it will appear here.</p>
          <Link
            to="/student/post-lost-item"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Post a Lost Item Request
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          to="/student/lost-found" 
          className="text-indigo-600 hover:text-indigo-800"
        >
          &larr; Back to Lost and Found
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">My Lost Item Requests</h1>
      </div>

      {/* Delete confirmation modal */}
      {deleteAlert.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this lost item request? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

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
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  to={`/student/lost-item/${item._id}`}
                  className="py-2 flex justify-center items-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
                <button
                  onClick={() => handleDeleteClick(item._id)}
                  className="py-2 flex justify-center items-center bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLostListingsPage;