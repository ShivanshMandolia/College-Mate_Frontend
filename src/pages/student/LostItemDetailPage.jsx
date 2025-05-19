import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  useGetLostItemByIdQuery,
  useDeleteLostItemMutation 
} from '../../features/lostFound/lostFoundApiSlice';
import { 
  Calendar, 
  MapPin, 
  Tag, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  ChevronLeft, 
  Trash2,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

const LostItemDetailPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  
  const { 
    data: item, 
    isLoading, 
    isError, 
    error 
  } = useGetLostItemByIdQuery(itemId);
  
  const [deleteLostItem, { isLoading: isDeleting }] = useDeleteLostItemMutation();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lost item request? This action cannot be undone.')) {
      try {
        await deleteLostItem(itemId).unwrap();
        navigate('/student/my-lost-listings');
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
        <Link to="/student/lost-found" className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Lost and Found
        </Link>
        
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-red-50 inline-flex rounded-full p-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Item not found</h3>
          <p className="mt-2 text-gray-500">
            {error?.data?.message || "This lost item request might have been removed or doesn't exist."}
          </p>
          <Link 
            to="/student/lost-and-found"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const lostItem = item.data;
  const isMyItem = lostItem.isOwner; // Assuming your API returns isOwner flag

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/student/lost-found" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Lost and Found
        </Link>
        
        {isMyItem && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete Request'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6">
            {lostItem.imageUrl ? (
              <img
                src={lostItem.imageUrl}
                alt={lostItem.title}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
                <Tag className="h-16 w-16 text-gray-300" />
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{lostItem.title}</h1>
              <span className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                LOST
              </span>
            </div>
            
            <div className="mb-6 p-3 bg-indigo-50 rounded-lg">
              <p className="text-indigo-600 flex items-center">
                <AlertTriangle className="inline-block w-5 h-5 mr-2" />
                Reported lost on {formatDate(lostItem.createdAt)} at {formatTime(lostItem.createdAt)}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <Tag className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Item Name</p>
                  <p className="font-medium text-gray-900">{lostItem.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Lost Near</p>
                  <p className="font-medium text-gray-900">{lostItem.landmark}</p>
                </div>
              </div>
              
              {lostItem.category && (
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900 capitalize">{lostItem.category}</p>
                  </div>
                </div>
              )}

              {lostItem.lostDate && (
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Date Lost</p>
                    <p className="font-medium text-gray-900">{formatDate(lostItem.lostDate)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700">{lostItem.description}</p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Posted By</p>
                    <p className="font-medium text-gray-900">{lostItem.postedBy?.name || "Anonymous"}</p>
                  </div>
                </div>
                
                {lostItem.postedBy?.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{lostItem.postedBy.email}</p>
                    </div>
                  </div>
                )}
                
                {lostItem.postedBy?.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{lostItem.postedBy.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostItemDetailPage;