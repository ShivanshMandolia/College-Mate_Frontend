import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  useGetFoundItemByIdQuery,
  useDeleteFoundItemMutation 
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
  AlertCircle
} from 'lucide-react';

const FoundItemDetailPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  
  const { 
    data: item, 
    isLoading, 
    isError, 
    error 
  } = useGetFoundItemByIdQuery(itemId);
  
  const [deleteFoundItem, { isLoading: isDeleting }] = useDeleteFoundItemMutation();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await deleteFoundItem(itemId).unwrap();
        navigate('/student/my-found-listings');
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
        <Link to="/student/lost-and-found" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Lost and Found
        </Link>
        
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-red-50 inline-flex rounded-full p-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Item not found</h3>
          <p className="mt-2 text-gray-500">
            {error?.data?.message || "This item might have been removed or doesn't exist."}
          </p>
          <Link 
            to="/student/lost-found"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const foundItem = item.data;
  const isMyItem = foundItem.isOwner; // Assuming your API returns isOwner flag

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/student/lost-found" className="text-blue-600 hover:text-blue-800 flex items-center">
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
            {isDeleting ? 'Deleting...' : 'Delete Item'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6">
            {foundItem.imageUrl ? (
              <img
                src={foundItem.imageUrl}
                alt={foundItem.title}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
                <Tag className="h-16 w-16 text-gray-300" />
              </div>
            )}
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{foundItem.title}</h1>
            
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-600 flex items-center">
                <Clock className="inline-block w-5 h-5 mr-2" />
                Found on {formatDate(foundItem.createdAt)} at {formatTime(foundItem.createdAt)}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <Tag className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Item Name</p>
                  <p className="font-medium text-gray-900">{foundItem.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Found Near</p>
                  <p className="font-medium text-gray-900">{foundItem.landmark}</p>
                </div>
              </div>
              
              {foundItem.category && (
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900 capitalize">{foundItem.category}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700">{foundItem.description}</p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Posted By</p>
                    <p className="font-medium text-gray-900">{foundItem.postedBy?.name || "Anonymous"}</p>
                  </div>
                </div>
                
                {foundItem.postedBy?.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{foundItem.postedBy.email}</p>
                    </div>
                  </div>
                )}
                
                {foundItem.postedBy?.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{foundItem.postedBy.phone}</p>
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

export default FoundItemDetailPage;